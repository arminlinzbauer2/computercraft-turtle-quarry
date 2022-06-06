package.path = package.path .. ';/libs/turtle/?.lua'
package.path = package.path .. ';/libs/util/?.lua'
local stripMine = require "stripmine"

local FUEL_REQUIREMENT_MULTIPLIER = 1
local ERROR_CODE_MISSING_ARG = 0x0001
local ERROR_CODE_INSUFFICIENT_FUEL = 0x0002

local argDistance = nil
local argReturn = nil

local function checkFuelLevel(distance, _return)
    local fuelLevel = turtle.getFuelLevel()
    local neededFuel = distance * FUEL_REQUIREMENT_MULTIPLIER

    if _return == true then
        neededFuel = neededFuel * 2
    end

    if neededFuel > fuelLevel then
        print("Insufficient fuel. Required units: " .. neededFuel .. ". Available units: " .. fuelLevel)
        return false
    end

    print("The operation will consume " .. neededFuel .. " fuel units. Available units: " .. fuelLevel)
    return true
end

local function setArg(arg)
    if arg == "--return" or arg == "-r" then
        argReturn = true
        return
    end

    if argDistance == nil then
        argDistance = tonumber(arg)
        return
    end
end

local function parseArgs(argv)
    for i = 1, #(argv), 1 do
        setArg(argv[i])
    end
end

local function main(argv)
    parseArgs(argv)

    if argDistance == nil then
        print("Missing argument 'distance'")
        return ERROR_CODE_MISSING_ARG
    end

    if not checkFuelLevel(argDistance, argReturn) then
        return ERROR_CODE_INSUFFICIENT_FUEL
    end

    stripMine.mine(argDistance)
    if argReturn then
        stripMine.backtrack(argDistance)
    end
end

local args = {}
for i = 1, #(arg), 1 do
    table.insert(args, arg[i])
end
main(args)