// Libs
import { Machine, StateNode, assign } from "xstate";
import { createModel } from "@xstate/test";
import { Page, Request } from "puppeteer";

// Text
import loginAppText from "./apps/login/components/text.json";

// Modules
import delay from "./modules/delay";
import { format } from "./modules/utils";
import { request } from "http";

type ExtractContext<T> = T extends StateNode<infer TContext, any, any, any>
  ? TContext
  : never;

const mockResponse = (failWith = "") => {
  if (failWith === "api") {
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
      [failWith === "decode" ? "missingUsername" : "username"]: "Tester",
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
const onRequest = async (interceptedRequest: Request): Promise<void> => {
  await delay(1000);

  const frameUrl = interceptedRequest.frame()?.url() || ""
  const url = interceptedRequest.url();

  if (/jsonplaceholder/.test(url)) {
    const [, failWith = ""] = frameUrl.match(/failWith=(.+)/) || [];

    if (failWith === "error") {
      return interceptedRequest.abort();
    }

    await interceptedRequest.respond(mockResponse(failWith));
  } else if (/googleapis/.test(url)) {
    interceptedRequest.abort();
  } else {
    interceptedRequest.continue();
  }
};

describe("Login", () => {
  beforeAll(async () => {
    await page.setRequestInterception(true);
    page.on("request", onRequest);
  });

  afterAll(async () => {
    page.off("request", onRequest);
    await page.setRequestInterception(false);
  });

  const loginMachine = Machine({
    id: "login-form",
    initial: "inProgress",
    context: {
      username: "",
      password: ""
    },
    on: {},
    states: {
      inProgress: {
        type: "parallel",
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
            cond: ctx => !!(ctx.username && ctx.password)
          },
          RESET: {
            target: "inProgress",
            actions: assign<{
              username: string;
              password: string;
            }>({ username: "", password: "" })
          }
        },
        states: {
          username: {
            meta: {
              test: async (page: Page) => {
                return true; // await page.waitFor('input[data-test="input-username"]');
              }
            },
            on: {
              CHANGE_USERNAME: {
                actions: assign<{
                  username: string;
                  password: string;
                }>({ username: (_: any, e: any) => e.value })
              }
            }
          },
          password: {
            meta: {
              test: async (page: Page) => {
                return true; // await page.waitFor('input[data-test="input-password"]');
              }
            },
            on: {
              CHANGE_PASSWORD: {
                actions: assign<{
                  username: string;
                  password: string;
                }>({ password: (_: any, e: any) => e.value })
              }
            }
          }
        }
      },
      submitting: {
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
            target: "inProgress",
            actions: assign<{
              username: string;
              password: string;
            }>({ username: "", password: "" })
          }
        }
      },
      apiFailure: {
        meta: {
          test: async (page: Page) => {
            await page.waitFor('[data-test="FailureMessage"]');
            const failureMessageEl = await page.$(
              '[data-test="FailureMessage"]'
            );

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
            target: "inProgress",
            actions: assign<{
              username: string;
              password: string;
            }>({ username: "", password: "" })
          }
        }
      },
      errorFailure: {
        meta: {
          test: async (page: Page) => {
            await page.waitFor('[data-test="FailureMessage"]');
            const failureMessageEl = await page.$(
              '[data-test="FailureMessage"]'
            );

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
            target: "inProgress",
            actions: assign<{
              username: string;
              password: string;
            }>({ username: "", password: "" })
          }
        }
      },
      decodeFailure: {
        meta: {
          test: async (page: Page) => {
            await page.waitFor('[data-test="FailureMessage"]');
            const failureMessageEl = await page.$(
              '[data-test="FailureMessage"]'
            );

            expect(failureMessageEl).toBeTruthy();

            if (failureMessageEl) {
              const text = await page.evaluate(
                el => el.textContent,
                failureMessageEl
              );
              expect(text).toEqual(
                loginAppText[
                  "The server has responded with an unknown response."
                ]
              );
            }
          }
        },
        on: {
          RESET: {
            target: "inProgress",
            actions: assign<{
              username: string;
              password: string;
            }>({ username: "", password: "" })
          }
        }
      },
      success: {
        meta: {
          test: async (page: Page) => {
            await page.waitFor("div#welcome");
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
            target: "inProgress",
            actions: assign<{
              username: string;
              password: string;
            }>({ username: "", password: "" })
          }
        }
      }
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

  testPlans.forEach(plan => {
    describe(plan.description, () => {
      plan.paths.forEach(path => {
        it(
          path.description,
          async () => {
            const failWith = /BAD_API/.test(path.description)
              ? "api"
              : /BAD_DECODE/.test(path.description)
              ? "decode"
              : /BAD_ERROR/.test(path.description)
              ? "error"
              : "";

            await page.goto(`http://localhost:7000?failWith=${failWith}`);
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
