import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CalloutComponent, PageContainerComponent, TranslatePipe} from 'clr-lift';
import {isFQDN, isHttps, isIP, isURL} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-url',
  imports: [PageContainerComponent, CalloutComponent, CodeBlockComponent, TranslatePipe],
  templateUrl: './url.component.html',
  styleUrl: './url.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UrlComponent {
  readonly firstCases = [
    {expression: "isIP('192.168.0.1')", result: String(isIP('192.168.0.1'))},
    {expression: "isFQDN('example.com')", result: String(isFQDN('example.com'))},
    {expression: "isURL('https://example.com')", result: String(isURL('https://example.com'))},
    {expression: "isHttps('http://example.com')", result: String(isHttps('http://example.com'))},
  ];
  readonly firstTaskCode = highlight(`import {isIP, isFQDN, isURL, isHttps} from 'ngx-lift';

isIP('192.168.0.1'); // true — expects a hostname/address, not a full URL
isFQDN('example.com'); // true — expects a hostname, not a scheme or path
isURL('https://example.com/path'); // true — absolute HTTP(S) URL
isURL('/relative/path'); // false
isHttps('http://example.com'); // false
isHttps('https://example.com'); // true
// Classification does not verify reachability, ownership, certificate validity, or trust.
// new URL(userInput) can throw; validate or catch when extracting a hostname.`);

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
console.log(isURL('invalid-url')); // false
console.log(isHttps('https://192.168.0.1')); // true
console.log(isHttps('http://www.example.com')); // false
  `);

  isIPSignatureCode = highlight(`isIP(hostname: string): boolean;`);

  isFQDNSignatureCode = highlight(`isFQDN(hostname: string): boolean;`);

  isURLSignatureCode = highlight(`isURL(url: string): boolean;`);

  isHttpsSignatureCode = highlight(`isHttps(url: string): boolean;`);
}
