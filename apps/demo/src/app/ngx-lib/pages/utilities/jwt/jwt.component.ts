import {ChangeDetectionStrategy, Component, computed, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent} from 'clr-lift';
import {decodeJwtPayload, isJwtExpiredByClaims} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-jwt-demo',
  imports: [PageContainerComponent, CodeBlockComponent, ClarityModule, FormsModule],
  templateUrl: './jwt.component.html',
  styleUrl: './jwt.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JwtDemoComponent {
  // Sample token with expiration
  tokenInput = signal(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwibmFtZSI6IkFsZXggSm9obnNvbiIsInJvbGVzIjpbImFkbWluIl0sImV4cCI6MjUwMDAwMDAwMH0.mock-signature',
  );
  offsetSeconds = signal(60);

  decodedPayload = computed(() => {
    const claims = decodeJwtPayload(this.tokenInput());
    return claims ? JSON.stringify(claims, null, 2) : 'Invalid or malformed token';
  });

  isExpired = computed(() => {
    const claims = decodeJwtPayload(this.tokenInput());
    return isJwtExpiredByClaims(claims, this.offsetSeconds());
  });

  codeSnippet = highlight(`
import {decodeJwtPayload, isJwtExpiredByClaims} from 'ngx-lift';

const token = 'header.payload.signature';

// Decode payload safely with UTF-8 support
const claims = decodeJwtPayload(token);
console.log(claims?.sub);

// Check expiration with safety buffer (e.g. 60 seconds)
if (isJwtExpiredByClaims(claims, 60)) {
  console.log('Token expired or expiring soon');
}
  `);
}
