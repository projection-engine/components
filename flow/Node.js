import randomID from "../../services/utils/misc/randomID";

export default class Node{
    canBeDeleted = true
    dynamicInputs = false
    constructor(inputs, output=[], dynamicInputs) {
        this.x = 10
        this.y = 10
        this.id = randomID()
        this.output = output
        this.inputs = inputs ? inputs : []

        this.dynamicInputs = dynamicInputs
    }


    compile(){}
}