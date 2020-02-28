// Libs
import { Machine, StateNode, assign, createMachine } from "xstate";
import { createModel } from "@xstate/test";
import { Page, Request } from "puppeteer";

// Text
import loginAppText from "./components/text.json";

// Modules
import delay from "../../modules/utils/delay";
import { format, returnSecond, isTruthy } from "../../modules/utils";
import { flow } from "fp-ts/lib/function";
import { dot } from "../../modules/fp";

// Types
type ExtractContext<T> = T extends StateNode<infer TContext, any, any, any>
  ? TContext
  : never;

type Context = {
  username: string;
  password: string;
};

type ChangeUsernameEvent = { type: "CHANGE_USERNAME"; value: string };
type ChangePasswordEvent = { type: "CHANGE_PASSWORD"; value: string };
type ResetEvent = { type: "RESET"; value: "" };
type SubmitEvent = { type: "SUBMIT"; value: "" };
type BadApiEvent = { type: "BAD_API"; value: "" };
type BadDecodeEvent = { type: "BAD_DECODE"; value: "" };
type BadErrorEvent = { type: "BAD_ERROR"; value: "" };
type OkEvent = { type: "OK"; value: "" };

type Event =
  | ChangeUsernameEvent
  | ChangePasswordEvent
  | ResetEvent
  | SubmitEvent
  | BadApiEvent
  | BadDecodeEvent
  | BadErrorEvent
  | OkEvent;

// Actions
const changeUsernameAction = assign<Context, Event>({
  username: flow(returnSecond, dot("value"))
});

const changePasswordAction = assign<Context, Event>({
  password: flow(returnSecond, dot("value"))
});

const resetAction = assign<Context, Event>({ username: "", password: "" });

// States nodes to be tested

/**
 * State node: Username
 */
const usernameState = {
  meta: {
    test: async (page: Page) => {
      await page.waitFor('input[data-test="input-username"]');
    }
  },
  on: {
    CHANGE_USERNAME: {
      actions: [changeUsernameAction]
    }
  }
};

/**
 * State node: Passsword
 */
const passwordState = {
  meta: {
    test: async (page: Page) => {
      await page.waitFor('input[data-test="input-password"]');
    }
  },
  on: {
    CHANGE_PASSWORD: {
      actions: [changePasswordAction]
    }
  }
};

const inProgressState = {
  type: "parallel" as const,
  meta: {
    test: async (page: Page) => {
      await page.waitFor('input[data-test="input-username"]');
      await page.waitFor('input[data-test="input-password"]');
      await page.waitFor('button[data-test="btn-login"]');
      await page.waitFor('button[data-test="btn-reset"]');
    }
  },
  on: {
    SUBMIT: {
      target: "submitting",
      cond: ({ username, password }: Context) =>
        isTruthy(username) && isTruthy(password)
    },
    RESET: {
      target: "#login.postReset",
      actions: resetAction
    }
  },
  states: {
    username: usernameState,
    password: passwordState
  }
};

const submittingState = {
  meta: {
    test: async (page: Page) => {
      await page.waitFor('button[data-test="btn-login"][disabled]');
      await page.waitFor('button[data-test="btn-reset"]');

      const usernameInputEl = await page.waitFor(
        'input[data-test="input-username"]'
      );

      const usernameIsDisabled = await page.evaluate(
        el => el.disabled,
        usernameInputEl
      );

      expect(usernameIsDisabled).toBe(true);

      const passwordInputEl = await page.waitFor(
        'input[data-test="input-password"]'
      );

      const passwordIsDisabled = await page.evaluate(
        el => el.disabled,
        passwordInputEl
      );

      expect(passwordIsDisabled).toBe(true);

      const btnResetEl = await page.$('button[data-test="btn-reset"]');

      const btnResetText = await page.evaluate(
        (button: HTMLButtonElement) => button.textContent,
        btnResetEl
      );

      expect(btnResetText).toMatch(/Cancel/);
    }
  },
  on: {
    BAD_API: "apiFailure",
    BAD_DECODE: "decodeFailure",
    BAD_ERROR: "errorFailure",
    OK: "success",
    RESET: {
      target: "#login.postSubmit",
      actions: resetAction
    }
  }
};

const apiFailureState = {
  meta: {
    test: async (page: Page) => {
      await page.waitFor('[data-test="btn-reset"]');
      await page.waitFor('[data-test="FailureMessage"]');
      const failureMessageEl = await page.$('[data-test="FailureMessage"]');

      expect(failureMessageEl).toBeTruthy();

      if (failureMessageEl) {
        const text = await page.evaluate(
          el => el.textContent,
          failureMessageEl
        );
        expect(text).toEqual(
          format(
            loginAppText["The server responded with code %code"],
            13,
            "Oops!"
          )
        );
      }
    }
  },
  on: {
    RESET: {
      target: "#login.postApiFailure",
      actions: resetAction
    }
  }
};

const errorFailureState = {
  meta: {
    test: async (page: Page) => {
      await page.waitFor('[data-test="btn-reset"]');
      await page.waitFor('[data-test="FailureMessage"]');
      const failureMessageEl = await page.$('[data-test="FailureMessage"]');

      expect(failureMessageEl).toBeTruthy();

      if (failureMessageEl) {
        const text = await page.evaluate(
          el => el.textContent,
          failureMessageEl
        );
        expect(text).toEqual(
          format(
            loginAppText["The following error has occurred"],
            "TypeError: Failed to fetch"
          )
        );
      }
    }
  },
  on: {
    RESET: {
      target: "#login.postError",
      actions: resetAction
    }
  }
};

const decodeFailureState = {
  meta: {
    test: async (page: Page) => {
      await page.waitFor('[data-test="btn-reset"]');
      await page.waitFor('[data-test="FailureMessage"]');
      const failureMessageEl = await page.$('[data-test="FailureMessage"]');

      expect(failureMessageEl).toBeTruthy();

      if (failureMessageEl) {
        const text = await page.evaluate(
          el => el.textContent,
          failureMessageEl
        );
        expect(text).toEqual(
          loginAppText["The server has responded with an unknown response."]
        );
      }
    }
  },
  on: {
    RESET: {
      target: "#login.postDecodeFailure",
      actions: resetAction
    }
  }
};

const successFailureState = {
  meta: {
    test: async (page: Page) => {
      await page.waitFor("div#welcome");
      await page.waitFor('[data-test="btn-reset"]');
      const divEl = await page.$("div#welcome");
      const text = await page.evaluate(
        (el: HTMLDivElement) => el.textContent,
        divEl
      );
      expect(text).toMatch(/Tester/);
    }
  },
  on: {
    RESET: {
      target: "#login.postSuccess",
      actions: resetAction
    }
  }
};

// Mocks

const mockResponse = (outcome = "") => {
  if (outcome === "BAD_API") {
    return {
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ code: 13, error: "Oops!" })
    };
  }

  return {
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      id: 1,
      name: "Leanne Graham",
      [outcome === "BAD_DECODE" ? "missingUsername" : "username"]: "Tester",
      email: "Sincere@april.biz",
      address: {
        street: "Kulas Light",
        suite: "Apt. 556",
        city: "Gwenborough",
        zipcode: "92998-3874",
        geo: {
          lat: "-37.3159",
          lng: "81.1496"
        }
      },
      phone: "1-770-736-8031 x56442",
      website: "hildegard.org",
      company: {
        name: "RomaguerCrona",
        catchPhrase: "Multi-layered client-server neural-net",
        bs: "harness real-time e-markets"
      }
    })
  };
};

/**
 * Event handler for intercepting network requests during tests.
 *
 * @param interceptedRequest Request object
 */
const onRequest = (patttern: string[]) => {
  const ln = patttern.length;
  let index = 0;

  return async (interceptedRequest: Request): Promise<void> => {
    await delay(2000);
  
    // const frameUrl = interceptedRequest.frame()?.url() || "";
    const url = interceptedRequest.url();
  
    if (/jsonplaceholder/.test(url)) {
      // const [, failWith = ""] = frameUrl.match(/failWith=(.+)/) || [];

      console.log("____________________________________________________________")
      const outcome = patttern.shift()
      console.log(`Intercepting: ${index++}: ${outcome}`)
      console.log("____________________________________________________________")
      if (outcome === "BAD_ERROR") {
        return interceptedRequest.abort();
      }
  
      await interceptedRequest.respond(mockResponse(outcome));
    } else if (/googleapis/.test(url)) {
      interceptedRequest.abort();
    } else {
      interceptedRequest.continue();
    }
  };
}

describe("Login", () => {
  const failurePattern: string[] = []

  beforeAll(async () => {
    await page.setRequestInterception(true);
    page.on("request", onRequest(failurePattern));
  });

  afterAll(async () => {
    page.off("request", onRequest);
    await page.setRequestInterception(false);
  });

  const states = {
    meta: {
      test: () => true
    },
    initial: "inProgress",
    states: {
      inProgress: inProgressState,
      submitting: submittingState,
      apiFailure: apiFailureState,
      decodeFailure: decodeFailureState,
      errorFailure: errorFailureState,
      success: successFailureState
    }
  };

  const loginMachine = createMachine<Context, Event>({
    id: "login",
    initial: "happyPath",
    context: {
      username: "",
      password: ""
    },
    states: {
      happyPath: states,
      postReset: states,
      postSubmit: states,
      postApiFailure: states,
      postDecodeFailure: states,
      postError: states,
      postSuccess: states
    }
  });

  const toggleModel = createModel<Page, ExtractContext<typeof loginMachine>>(
    loginMachine
  ).withEvents({
    CHANGE_USERNAME: {
      cases: [{ value: "chautelly" }, { value: "" }],
      exec: async (page: Page, e) => {
        // @ts-ignore
        page.type('input[data-test="input-username"]', e.value);
      }
    },
    CHANGE_PASSWORD: {
      cases: [{ value: "p@asswor1" }, { value: "" }],
      exec: async (page: Page, e) => {
        // @ts-ignore
        page.type('input[data-test="input-password"]', e.value);
      }
    },
    SUBMIT: {
      exec: async (page: Page) => {
        await page.click('button[data-test="btn-login"]');
      }
    },
    OK: {
      exec: async () => true
    },
    BAD_API: {
      exec: async () => true
    },
    BAD_DECODE: {
      exec: async () => true
    },
    BAD_ERROR: {
      exec: async () => true
    },
    RESET: {
      exec: async (page: Page) => {
        page.click('[data-test="btn-reset"]');
      }
    }
  });

  const testPlans = toggleModel
    .getShortestPathPlans({
      // filter: state => state.matches('bad')
    })
    .reverse();

  const seventeen = testPlans.slice(0, 18)

  seventeen.forEach((plan, i) => {
    describe(`(${i}): ${plan.description}`, () => {
      plan.paths.forEach((path, j) => {
        failurePattern.push(...path.description.match(/OK|BAD_API|BAD_DECODE|BAD_ERROR/g) || [])
        it(
          `(${i}, ${j}): ${path.description}`,
          async () => {
            await page.goto(`http://localhost:7000`);
            await path.test(page);
          },
          60000
        );
      });
    });
  });

  it("coverage", () => {
    toggleModel.testCoverage();
  });
});
