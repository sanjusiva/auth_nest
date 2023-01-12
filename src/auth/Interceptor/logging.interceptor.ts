
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    console.log('Before...');
    const userAgent=context.switchToHttp().getRequest().headers['user-agent']
    // console.log("bvcxcvbnmnbhvgfcdxsxfcvb: ",userAgent);
    
    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap((data)=>{
            console.log(`After... ${Date.now() - now}ms`)
            // console.log("data: ",data);
            // console.log("userAgent: ",userAgent);
          
        }),
        catchError((err)=>{
            console.log('err caught in interceptor: ',err);
            throw err
            
        })
      );

  }
}
