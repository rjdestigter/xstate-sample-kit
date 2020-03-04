import { createMachine, assign, interpret } from 'xstate'

const context =  {
  questions: ["Q1", "Q2"],
  current: 0,
  answers: new Map()
}

const machine = createMachine(
  {
    id: "quiz",
    initial: "quizzing",
    context,
    states: {
      quizzing: {
        after: { 15000: "done" },
        initial: "questioning",
        states: {
          questioning: {
            after: { 5000: "timeout" },
            on: {
              ANSWER: [
                { target: "#quiz.done", cond: "noMoreQuestions" },
                { target: "questioning", internal: false, actions: "increment" }
              ]
            }
          },
          timeout: {  
            entry: ["increment"],
            after: { 2500: "questioning" }
          }
        }
      },
      done: {}
    }
  },
  {
    actions: {
      increment: assign({
        current: ctx => ctx.current + 1,
        answers: (ctx, e) => {
          // @ts-ignore
          ctx.answers.set(ctx.current, e.answer) // e.answer
          return ctx.answers
        }
      })
    },
    guards: {
      noMoreQuestions: ctx => ctx.current === ctx.questions.length - 1
    }
  }
);


Object.assign(window, { service: interpret(machine).onTransition(state => {
  console.warn(state.event)
  console.log(state.value)
  
})})