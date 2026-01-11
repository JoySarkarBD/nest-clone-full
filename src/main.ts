import "reflect-metadata";
import { AppModule } from "./app.module";
import { exceptionFilter } from "./common/filters/exception.filter";
import { bootstrap } from "./core/bootstrap";

const app = bootstrap(AppModule);
app.use(exceptionFilter);

app.listen(3000, () => console.log("server running on http://localhost:3000"));
