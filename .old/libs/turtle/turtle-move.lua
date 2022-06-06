local cardinalMovements = {
    up = turtle.up,
    down = turtle.down,
    forward = turtle.forward,
    backward = turtle.back,
}

local function move(direction)
    if direction == nil then
        direction = "forward"
    end

    local movement = cardinalMovements[direction]
    if movement == nil then
        return false
    end

    return movement()
end

return move