function f1() {

}

function f2(something) {}

function f3(a1, a2, a3, a4) {}

const c1 = () => {}
const c2 = (a1, a2) => a2

function main() {
  console.log(`f1 = ${f1.length}`)
  console.log(`f2 = ${f2.length}`)
  console.log(`f3 = ${f3.length}`)
  console.log(`c1 = ${c1.length}`)
  console.log(`c2 = ${c2.length}`)
}

main()
