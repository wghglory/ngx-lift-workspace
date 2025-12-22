import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CalloutComponent, PageContainerComponent} from 'clr-lift';
import {isFQDN, isHttps, isIP, isURL} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-url',
  standalone: true,
  imports: [PageContainerComponent, CalloutComponent, CodeBlockComponent, RouterLink],
  templateUrl: './url.component.html',
  styleUrl: './url.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UrlComponent {
  constructor() {
    console.log(isFQDN('www.example.com'));
    console.log(isFQDN('192.168.0.1'));

    console.log(isIP('www.example.com'));
    console.log(isIP('192.168.0.1'));

    console.log(isURL('http://www.example.com'));
    console.log(isHttps('https://192.168.0.1'));
  }

  ipAndFqdnCode = highlight(`
import {isFQDN, isIP} from 'ngx-lift';

console.log(isFQDN('www.example.com')); // true
console.log(isFQDN('192.168.0.1')); // false

console.log(isIP('www.example.com')); // false
console.log(isIP('192.168.0.1')); // true
    `);

  tryCatchCode = highlight(`
import {isFQDN} from 'ngx-lift';

try {
  const hostname = new URL('your-url').hostname;

  if (isFQDN(hostname)) {
    // the rest of your logic
  }
} catch (error) {
  // your-url is invalid
  console.error(error);
}
        `);

  urlCode = highlight(`
import {isHttps, isURL} from 'ngx-lift';

console.log(isURL('http://www.example.com')); // true
console.log(isHttps('https://192.168.0.1')); // true
    `);
}
