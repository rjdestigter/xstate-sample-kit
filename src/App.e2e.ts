import { Machine, StateNode, assign } from "xstate";
import { createModel } from "@xstate/test";
import { Page, Request } from "puppeteer";

type ExtractContext<T> = T extends StateNode<infer C, any, any, any>
  ? C
  : never;

const mockResponse = (doFail = false) => ({
  status: doFail ? 500 : 200,
  contentType: "application/json",
  body: JSON.stringify({
    id: 1,
    name: "Leanne Graham",
    [doFail ? "missingUsername" : "username"]: "Tester",
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
});

/**
 * Event handler for intercepting network requests during tests.
 *
 * @param interceptedRequest Request object
 */
const onRequest = async (interceptedRequest: Request): Promise<void> => {
  if (/jsonplaceholder/.test(interceptedRequest.url())) {
    const doFail = /fail=true/.test(interceptedRequest.frame()!.url()!);
    await interceptedRequest.respond(mockResponse(doFail));
  } else if (/googleapis/.test(interceptedRequest.url())) {
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
                return true // await page.waitFor('input[data-test="input-username"]');
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
                return true // await page.waitFor('input[data-test="input-password"]');
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
            await page.waitFor('button[data-test="btn-login"][disabled');
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

            // const buttonEl = await page.$("button[data-test=\"btn-login\"]");

            // const buttonText = await page.evaluate(
            //   (button: HTMLButtonElement) => button.textContent,
            //   buttonEl
            // );

            // expect(buttonText).toMatch(/authenticating/);

            const btnResetEl = await page.$('button[data-test="btn-reset"]');

            const btnResetText = await page.evaluate(
              (button: HTMLButtonElement) => button.textContent,
              btnResetEl
            );

            expect(btnResetText).toMatch(/Cancel/);
          }
        },
        on: {
          BAD: "failure",
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
      failure: {
        meta: {
          test: async (page: Page) => {
            await page.waitFor("div.fail");
            const divEl = await page.$("div.fail");
            const text = await page.evaluate(
              (el: HTMLDivElement) => el.textContent,
              divEl
            );
            expect(text).toMatch(/Something went terribly wrong/);
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
    BAD: {
      exec: async () => true
    },
    RESET: {
      exec: async (page: Page) => {
        page.click('[data-test="btn-reset"]');
      }
    }
  });

  const testPlans = toggleModel.getShortestPathPlans({});

  testPlans.forEach(plan => {
    describe(plan.description, () => {
      plan.paths.forEach(path => {
        it(
          path.description,
          async () => {
            await page.goto(
              "http://localhost:7000?fail=" + /BAD/.test(path.description)
            );
            await path.test(page);
          },
          5000
        );
      });
    });
  });

  it("coverage", () => {
    toggleModel.testCoverage();
  });
});
