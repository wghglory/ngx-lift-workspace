import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {certificateIcon, ClarityIcons, heatMapIcon, objectsIcon, radarIcon, wrenchIcon} from '@cds/core/icon';
import {ClarityModule} from '@clr/angular';
import {SvgIconComponent} from 'angular-svg-icon';
import {ClarityTheme, ThemeToggleComponent, ToastContainerComponent} from 'clr-lift';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';

import {VerticalNavComponent} from './core/components/vertical-nav/vertical-nav.component';

// register the languages you need
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('javascript', javascript);

// register clarity icons
ClarityIcons.addIcons(objectsIcon, wrenchIcon, certificateIcon, heatMapIcon, radarIcon);

ClarityIcons.addIcons([
  'pipes',
  `<svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M1.33204 17H5.85613C6.03967 17 6.18817 16.8567 6.18817 16.68V14.9417C6.18817 14.765 6.03967 14.6217 5.85613 14.6217H5.25164L5.23192 5.6825C5.23128 5.4114 5.34054 5.15626 5.539 4.96423C5.73711 4.77219 6.00431 4.66626 6.29356 4.66562C6.57403 4.66562 6.838 4.77062 7.03644 4.96157C7.23587 5.15297 7.34578 5.40765 7.34611 5.67891L7.35583 12.3255C7.35746 13.4456 7.81208 14.498 8.63504 15.2884C9.45575 16.0767 10.5459 16.5108 11.7045 16.5108C11.7048 16.5108 11.7136 16.5108 11.7139 16.5108C12.8757 16.5084 13.9672 16.0703 14.7869 15.2771C15.6067 14.4839 16.0567 13.4305 16.0541 12.3108L16.0347 3.37828H16.668C16.8515 3.37828 17 3.235 17 3.05829V1.31999C17 1.14328 16.8515 1 16.668 1H12.1442C11.9607 1 11.8122 1.14328 11.8122 1.31999V3.05829C11.8122 3.235 11.9607 3.37828 12.1442 3.37828H12.7383L12.758 12.3174C12.7587 12.5884 12.6494 12.8436 12.4509 13.0356C12.2528 13.2277 11.9885 13.3336 11.7048 13.3342C11.4243 13.3342 11.1604 13.2292 10.9619 13.0383C10.7625 12.8469 10.6526 12.592 10.652 12.321L10.6425 5.67468C10.6412 4.55453 10.187 3.50203 9.36334 2.71124C8.54231 1.92313 7.44954 1.48907 6.27606 1.48907C5.11422 1.49141 4.02275 1.92954 3.20302 2.72281C2.3833 3.51594 1.93323 4.56954 1.93582 5.68907L1.95554 14.6217H1.33204C1.1485 14.6217 1 14.765 1 14.9417V16.68C1 16.8567 1.1485 17 1.33204 17ZM12.4762 1.64001H16.3359V2.73829H15.702H13.0696H12.4762V1.64001ZM3.67385 3.17438C4.36842 2.50234 5.29289 2.13111 6.28577 2.12906C7.2725 2.12906 8.19891 2.49688 8.89445 3.16469C9.59227 3.83469 9.97717 4.72641 9.97847 5.67548L9.98786 12.322C9.98852 12.7642 10.1682 13.1797 10.4931 13.4916C10.817 13.8028 11.2473 13.9742 11.7084 13.9742C12.1675 13.9733 12.5985 13.8003 12.9218 13.4872C13.2451 13.1741 13.4228 12.7581 13.4221 12.3161L13.4023 3.37828H15.3706L15.3901 12.312C15.392 13.2608 15.0107 14.1534 14.3161 14.8255C13.6215 15.4975 12.6971 15.8688 11.7133 15.8708H11.7045C10.723 15.8708 9.79913 15.503 9.10393 14.835C8.40645 14.1653 8.02153 13.2738 8.01993 12.3245L8.01019 5.67814C8.00988 5.23594 7.83055 4.82047 7.50533 4.50827C7.18138 4.19703 6.75108 4.02563 6.29 4.02563C5.82533 4.02657 5.39147 4.19953 5.06818 4.51266C4.74489 4.82579 4.56719 5.24171 4.56785 5.68375L4.58761 14.6216H2.61969L2.5999 5.68782C2.59796 4.73907 2.97927 3.84642 3.67385 3.17438ZM1.66407 15.2617H5.52407V16.36H1.66407V15.2617Z" fill="currentColor"/>
  </svg>`,
]);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    VerticalNavComponent,
    ThemeToggleComponent,
    ToastContainerComponent,
    SvgIconComponent,
    ClarityModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  onThemeChange(theme: ClarityTheme) {
    const linkElement = document.querySelector('#highlightLink');

    if (linkElement) {
      const newHref = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-${theme}.min.css`;
      linkElement.setAttribute('href', newHref);
    }
  }
}
