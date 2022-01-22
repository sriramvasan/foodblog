import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import {  Subscription } from "rxjs";

import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";
import { AuthService } from "./auth.service";
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/aut.actions';

@Component({
    selector : 'app-auth',
    templateUrl :'./auth.component.html'  
})
export class AuthComponent implements OnInit ,OnDestroy {

    isLoginMode : boolean = true;
    isLoading : boolean = false;
    error : string = null;
    @ViewChild(PlaceholderDirective) alertHost : PlaceholderDirective;

    private closeSub : Subscription;
    private storeSub : Subscription;

    constructor(private authService : AuthService , 
        private router: Router, 
        private componentFactoryResolver : ComponentFactoryResolver,
        private store : Store<fromApp.AppState> )
    {

    }

    ngOnInit(): void {
        this.storeSub = this.store.select('auth').subscribe(authState =>{
            this.isLoading = authState.loading;
            this.error = authState.authError;
            if(this.error){
                this.showErrorAlert(this.error);
            }
        })
    }

    onSwitchMode(){
        this.isLoginMode = ! this.isLoginMode;
    }
    
    onSubmit(form : NgForm){
        if(!form.valid){
            return;
        }

        const email = form.value.email;
        const password = form.value.password;

        this.isLoading = true;

        if(this.isLoginMode){
            this.store.dispatch(new AuthActions.LoginStart({email,password}));
        }
        else{
            this.store.dispatch(new AuthActions.SignupStart({email,password}));
        }
        form.reset();
    }

    onHandleError(){
        this.store.dispatch(new AuthActions.ClearError());
    }

    ngOnDestroy(): void {
        if(this.closeSub){
            this.closeSub.unsubscribe(); 
        }   
        if(this.storeSub){
            this.storeSub.unsubscribe();
        }
    }

    private showErrorAlert(errorMessage : string){
        const alertCmpFactory =  this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    
        const hostViewContainerRef = this.alertHost.viewContainerRef
        hostViewContainerRef.clear();

        const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
    
        componentRef.instance.message = errorMessage;
        this.closeSub = componentRef.instance.close.subscribe(()=>{
            this.closeSub.unsubscribe();
            hostViewContainerRef.clear();
        })
    }
}