export class BaseController {
    constructor() {
        if (new.target === BaseController) {
            throw new Error("Cannot instantiate abstract class BaseController");
        }
    }

    process(req, res) {
        throw new Error("Method 'execute()' must be implemented.");
    }
}
