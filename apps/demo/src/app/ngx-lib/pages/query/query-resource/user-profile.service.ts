import {Injectable} from '@angular/core';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

@Injectable({providedIn: 'root'})
export class UserProfileService {
  private profile: UserProfile = {
    id: 'usr-901',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    role: 'Platform Admin',
  };

  async getProfile(): Promise<UserProfile> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return this.profile;
  }

  async updateProfile(changes: Partial<UserProfile>): Promise<UserProfile> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    this.profile = {...this.profile, ...changes};
    return this.profile;
  }
}
