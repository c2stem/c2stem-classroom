import { ElementRef, Renderer2, OnInit } from '@angular/core';
export declare class MdbCardComponent implements OnInit {
    private _el;
    private _r;
    class: string;
    cascade: boolean;
    wider: boolean;
    card: ElementRef;
    narrower: boolean;
    reverse: boolean;
    dark: boolean;
    bgColor: string;
    borderColor: string;
    constructor(_el: ElementRef, _r: Renderer2);
    ngOnInit(): void;
}
