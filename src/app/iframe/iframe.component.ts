import {Component, Input, OnInit} from '@angular/core';
import {SafeUrl, DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-iframe',
  templateUrl: './iframe.component.html',
  styleUrls: ['./iframe.component.scss']
})
export class IframeComponent implements OnInit {

  iframe_src: SafeResourceUrl;
  @Input() userName: string;
  @Input() project: string;
  private credential: string;
  public NETSBLOX_URL: string;
  encodeURI(uri: string): string {
    return encodeURI(uri);
  }
  constructor(public sanitizer: DomSanitizer) {
    this.NETSBLOX_URL = 'https://editor.c2stem.org/';
    this.credential = '?editMode=true&action=present&Username=\'+userName+\'&ProjectName=\'+project';
    this.iframe_src = sanitizer.bypassSecurityTrustResourceUrl(this.NETSBLOX_URL.concat(this.credential));
    console.log(this.iframe_src);
    this.userName = 'new';
  }
  ngOnInit() {
  }
}

