local move = require "turtle-move"

local function digBlockAndMove(direction)
    if turtle.detect() then
        turtle.dig()
    end
    move(direction)
end

local function digColumn()
    digBlockAndMove()
    if turtle.detectUp() then
        turtle.digUp()
    end
end

local function mine(distance)
    for i = 1, distance, 1 do
        digColumn()
    end
end

local function backtrack(distance)
    turtle.turnLeft()
    turtle.turnLeft()
    for i = 1, distance, 1 do
        move()
    end
    turtle.turnLeft()
    turtle.turnLeft()
end

return { mine = mine, backtrack = backtrack }