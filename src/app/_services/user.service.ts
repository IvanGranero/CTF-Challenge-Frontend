import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { User, Doc } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Doc[]>(`${environment.apiUrl}/files`);
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/register`, user);
    }

    download(filePath: string) {
        return this.http.get(`${environment.apiUrl}/files/${filePath}`);
    }

    upload(file: File) {
        const formData = new FormData(); 
        formData.append("file", file, file.name);
        return this.http.post(`${environment.apiUrl}/upload`, formData);
    }

    delete(filePath: string) {
        return this.http.delete<Doc[]>(`${environment.apiUrl}/files/${filePath}`);
    }
}