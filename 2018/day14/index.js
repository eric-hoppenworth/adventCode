const hotChocAmount = 598701;

let scoreCard = [3,7];

function Elf(pointer) {
    this.pointer = pointer;
    this.lastValue = null
}

const elves = [new Elf(0), new Elf(1)]

function getNewScores(elves, scoreCard) {
    let sum = elves.reduce((carry, elf) => {
        elf.lastValue = scoreCard[elf.pointer]
        let value = carry + scoreCard[elf.pointer]
        return value
    }, 0)
    return sum.toString().split('').map(item => parseInt(item, 10))
}

for (let i = 0; i < hotChocAmount ; i++) {
    scoreCard = scoreCard.concat(getNewScores(elves, scoreCard))
    elves.forEach(elf => {
        elf.pointer = (elf.pointer + elf.lastValue + 1) % scoreCard.length
    })
}

// console.log(scoreCard)