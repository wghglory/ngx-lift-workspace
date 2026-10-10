import {ChangeDetectionStrategy, Component, computed, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent} from 'clr-lift';
import {deleteValueByPath, getValueByPath} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-object-path',
  imports: [PageContainerComponent, CodeBlockComponent, ClarityModule, FormsModule],
  templateUrl: './object-path.component.html',
  styleUrl: './object-path.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObjectPathComponent {
  sampleObject = signal({
    user: {
      profile: {
        name: 'Alex Johnson',
        role: 'Cluster Admin',
        contact: {
          email: 'alex@example.com',
          phone: '+1-555-0199',
        },
      },
    },
    settings: {
      theme: 'dark',
      notifications: true,
    },
  });

  queryPath = signal('user.profile.contact.email');
  deletePath = signal('user.profile.contact.phone');

  resolvedValue = computed(() => {
    const val = getValueByPath(this.sampleObject(), this.queryPath());
    return val !== undefined ? JSON.stringify(val, null, 2) : 'undefined';
  });

  formattedSample = computed(() => JSON.stringify(this.sampleObject(), null, 2));

  getValueCode = highlight(`
import {getValueByPath} from 'ngx-lift';

const user = {profile: {details: {name: 'Alice'}}};
const name = getValueByPath<string>(user, 'profile.details.name'); // 'Alice'
const missing = getValueByPath(user, 'profile.avatar.url'); // undefined
  `);

  deleteValueCode = highlight(`
import {deleteValueByPath} from 'ngx-lift';

const config = {server: {host: 'localhost', port: 8080}};
deleteValueByPath(config, 'server.port');
// config is now { server: { host: 'localhost' } }
  `);

  handleDelete(): void {
    const clone = JSON.parse(JSON.stringify(this.sampleObject()));
    deleteValueByPath(clone, this.deletePath());
    this.sampleObject.set(clone);
  }

  resetObject(): void {
    this.sampleObject.set({
      user: {
        profile: {
          name: 'Alex Johnson',
          role: 'Cluster Admin',
          contact: {
            email: 'alex@example.com',
            phone: '+1-555-0199',
          },
        },
      },
      settings: {
        theme: 'dark',
        notifications: true,
      },
    });
  }
}
