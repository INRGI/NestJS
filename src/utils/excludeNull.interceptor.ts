import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, map } from "rxjs";
import recursivelyStripNullValues from "./recursivelyStripNullValues";

@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(map(value => recursivelyStripNullValues(value)));
    }
}