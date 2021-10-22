import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { User, Doc } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit, OnDestroy {
    currentUser: User;
    currentUserSubscription: Subscription;
    docs: Doc[] = [];
    alldocs: Doc[] = [];
    searchTerm: string = "";
    loading: boolean = false;
    file: File = null;    

    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
    }

    ngOnInit() {
        this.loadAllDocs();
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

    remove(filePath: string) {
        this.userService.delete(filePath).pipe(first()).subscribe(docs => {
            this.alldocs = this.alldocs.filter((c: any) => c.filePath !== filePath);
            this.docs = this.docs.filter((c: any) => c.filePath !== filePath);
        });
    }

    download(filePath: string) {
        this.userService.download(filePath).pipe(first()).subscribe(() => {
        });
    }

    private loadAllDocs() {
        this.userService.getAll().pipe(first()).subscribe(docs => {
            this.alldocs = docs;
            this.assignCopy();
        });
    }

    assignCopy() {
        this.docs = Object.assign([], this.alldocs);
      }

    onChange(event) {
        this.file = event.target.files[0];
    }
  
    // OnClick of button Upload
    onUpload() {
        this.loading = !this.loading;
        this.userService.upload(this.file).subscribe(
            (event: any) => {
                if (typeof (event) === 'object') {
                    this.loading = false; 
                }
                location.reload();
            }
        );
    }

    isImage(mimeType: string) : boolean {
        return mimeType.split("/")[0] === "image";
    }

    search(): void {
        this.docs = this.alldocs.filter(
          (el) => 
          el.originalName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          el.mimeType.toLowerCase().includes(this.searchTerm.toLowerCase()) 
        );
      }

}