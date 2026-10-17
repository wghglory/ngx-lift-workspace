import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class ProjectService {
  private projectReads = 0;

  async getProject(id: string): Promise<{id: string; name: string; revision: number}> {
    const revision = ++this.projectReads;
    await new Promise((resolve) => setTimeout(resolve, 350));
    return {
      id,
      name: id === 'website-redesign' ? 'Website redesign' : 'Mobile application',
      revision,
    };
  }
}
