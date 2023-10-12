"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const admins_js_1 = __importDefault(require("./routes/admins.js"));
const users_js_1 = __importDefault(require("./routes/users.js"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
mongoose_1.default.connect('mongodb+srv://krishnaprasadawala:krishna@cluster1.hvowd8q.mongodb.net/test', { dbName: "test" });
app.use('/admins', admins_js_1.default);
app.use('/users', users_js_1.default);
app.get('/', (req, res) => {
    res.send("Hello From Homepage");
});
app.listen(PORT, () => {
    console.log(`server listening on http://localhost:${PORT}`);
});
