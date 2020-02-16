import { Page } from "puppeteer";
import { Machine } from "xstate";
import { createModel } from "@xstate/test";

declare const page: Page;

const toggleMachine = Machine({
  id: "toggle",
  initial: "inactive",
  states: {
    inactive: {
      on: {
        TOGGLE: "active"
      },
      meta: {
        test: async (page: Page) => {
          await page.waitFor("input#btn:not(:checked)");
        }
      }
    },
    active: {
      on: {
        TOGGLE: "inactive"
      },
      meta: {
        test: async (page: Page) => {
          await page.waitFor("input#btn:checked");
        }
      }
    }
  }
});

const toggleModel = createModel<Page>(toggleMachine).withEvents({
  TOGGLE: {
    exec: async (page: Page) => {
      return await page.click("input#btn");
    }
  }
});

describe("toggle", () => {
  const testPlans = toggleModel.getShortestPathPlans();

  testPlans.forEach(plan => {
    describe(plan.description, () => {
      plan.paths.forEach(path => {
        it(path.description, async () => {
          await path.test(page);
        });
      });
    });
  });

  it("should have full coverage", () => {
    return toggleModel.testCoverage();
  });
});
