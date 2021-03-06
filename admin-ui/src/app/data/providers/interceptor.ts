import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { API_URL } from '../../app.config';
import { AuthService } from '../../core/providers/auth/auth.service';
import { _ } from '../../core/providers/i18n/mark-for-extraction';
import { LocalStorageService } from '../../core/providers/local-storage/local-storage.service';
import { NotificationService } from '../../core/providers/notification/notification.service';

import { DataService } from './data.service';

export const AUTH_REDIRECT_PARAM = 'redirectTo';

/**
 * The default interceptor examines all HTTP requests & responses and automatically updates the requesting state
 * and shows error notifications.
 */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
    constructor(
        private dataService: DataService,
        private injector: Injector,
        private authService: AuthService,
        private router: Router,
        private localStorageService: LocalStorageService,
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.dataService.client.startRequest().subscribe();
        return next.handle(req).pipe(
            tap(
                event => {
                    if (event instanceof HttpResponse) {
                        this.notifyOnError(event);
                        this.dataService.client.completeRequest().subscribe();
                    }
                },
                err => {
                    if (err instanceof HttpErrorResponse) {
                        this.notifyOnError(err);
                        this.dataService.client.completeRequest().subscribe();
                    } else {
                        this.displayErrorNotification(err.message);
                    }
                },
            ),
        );
    }

    private notifyOnError(response: HttpResponse<any> | HttpErrorResponse) {
        if (response instanceof HttpErrorResponse) {
            if (response.status === 0) {
                this.displayErrorNotification(_(`error.could-not-connect-to-server`), { url: API_URL });
            } else {
                this.displayErrorNotification(response.toString());
            }
        } else {
            // GraphQL errors still return 200 OK responses, but have the actual error message
            // inside the body of the response.
            const graqhQLErrors = response.body.errors;
            if (graqhQLErrors && Array.isArray(graqhQLErrors)) {
                const firstCode: string = graqhQLErrors[0].extensions.code;
                if (firstCode === 'FORBIDDEN') {
                    this.authService.logOut().subscribe(() => {
                        if (!window.location.pathname.includes('login')) {
                            this.displayErrorNotification(_(`error.403-forbidden`));
                        }
                        this.router.navigate(['/login'], {
                            queryParams: {
                                [AUTH_REDIRECT_PARAM]: btoa(this.router.url),
                            },
                        });
                    });
                } else {
                    const message = graqhQLErrors.map(err => err.message).join('\n');
                    this.displayErrorNotification(message);
                }
            }
        }
    }

    /**
     * We need to lazily inject the NotificationService since it depends on the I18nService which
     * eventually depends on the HttpClient (used to load messages from json files). If we were to
     * directly inject NotificationService into the constructor, we get a cyclic dependency.
     */
    private displayErrorNotification(message: string, vars?: Record<string, any>): void {
        const notificationService = this.injector.get<NotificationService>(NotificationService);
        notificationService.error(message, vars);
    }
}
