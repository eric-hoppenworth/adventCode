export default
`Monkey 0:
  Starting items: 89, 95, 92, 64, 87, 68
  Operation: new = old * 11
  Test: divisible by 2
    If true: throw to monkey 7
    If false: throw to monkey 4

Monkey 1:
  Starting items: 87, 67
  Operation: new = old + 1
  Test: divisible by 13
    If true: throw to monkey 3
    If false: throw to monkey 6

Monkey 2:
  Starting items: 95, 79, 92, 82, 60
  Operation: new = old + 6
  Test: divisible by 3
    If true: throw to monkey 1
    If false: throw to monkey 6

Monkey 3:
  Starting items: 67, 97, 56
  Operation: new = old * old
  Test: divisible by 17
    If true: throw to monkey 7
    If false: throw to monkey 0

Monkey 4:
  Starting items: 80, 68, 87, 94, 61, 59, 50, 68
  Operation: new = old * 7
  Test: divisible by 19
    If true: throw to monkey 5
    If false: throw to monkey 2

Monkey 5:
  Starting items: 73, 51, 76, 59
  Operation: new = old + 8
  Test: divisible by 7
    If true: throw to monkey 2
    If false: throw to monkey 1

Monkey 6:
  Starting items: 92
  Operation: new = old + 5
  Test: divisible by 11
    If true: throw to monkey 3
    If false: throw to monkey 0

Monkey 7:
  Starting items: 99, 76, 78, 76, 79, 90, 89
  Operation: new = old + 7
  Test: divisible by 5
    If true: throw to monkey 4
    If false: throw to monkey 5`
