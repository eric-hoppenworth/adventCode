// create an algorithm that can path to a specifc location
// it should be able to count the number of spaces it takes to get to that location

// search the board for each lowercase letter and uppercase letter
// store thier locations in memory

// I could solve this like a puzzle...
// path from @ to every other letter, listing the uppercase letters that are in the path.
// there should be a small set that has no doors.
// we will arbitrarily choose to go to the FIRST key with no doors in the way.
// TODO: realistically, we will have to make some queue to push these options into

// after moving to that key (let's say b) remove B from the door list and b from the key list
// path to every other letter, listing the uppercase letters that are in the path.
// move to one of the keys with no doors...

// repeat

// all the while, I will need to sum the distances traveled
// one of these paths will be the shortest, but I really can't know without trying each one.
