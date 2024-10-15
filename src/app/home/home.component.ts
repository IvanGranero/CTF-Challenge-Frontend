import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { User } from '@app/_models';
import { UserService, AlertService, AuthenticationService } from '@app/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnDestroy, OnInit {
    currentUser: User;
    currentUserSubscription: Subscription;
    loading: boolean = false;
    homeForm: FormGroup;
    submitted: boolean = false;
    returnUrl: string;  
    sshkey: string;
    html1 = '<h1>Capture The Firmware</h1>';
    html2 = 'Challenge Description:<br>Your goal is to capture the flag inside the memory of an emulated ECU.<br>The memory region starts at 0x1000 and the flag format is FLAG{example_of_flag}';
    html3 = 'Challenge setup:<br>Submit your public ssh key and access the challenge as canopener@159.203.130.92<br>can-utils and caringcaribou (cc.py) are already installed, canbus is over vcan0.';
    //html4 = 'Hint:<br>https://ioactive.com/adventures-in-automotive-networks-and-control-units/';
    html5 = 'Rules of engagement:<br>You are only allowed to write and read out of the VCAN0 bus<br>do not change anything else<br>files and directories within the server are out of the scope of this challenge.';

    constructor(
        private formBuilder: FormBuilder,  
        private route: ActivatedRoute,              
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

    ngOnInit() {     
        this.sshkey = this.currentUser.sshkey           
        this.homeForm = this.formBuilder.group({
            sshkey: ['', Validators.required]
        });
        
    }    

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

    // convenience getter for easy access to form fields
    get f() { return this.homeForm.controls; }    

    // OnClick of button Submit key
    onSubmit() {

        this.submitted = true;

        // stop here if form is invalid
        if (this.homeForm.invalid) {
            return;
        }

        this.loading = true;
        this.userService.submitkey(this.homeForm.value).subscribe(
            data => {            
                this.currentUser.sshkey = this.f.sshkey.value;
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                this.alertService.success('SSH key has been updated', true);                
                location.reload();
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            }
        );
    }  

}