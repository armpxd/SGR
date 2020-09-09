import { Injectable, ComponentFactoryResolver, Injector, Inject, EventEmitter } from '@angular/core';
import { DOCUMENT } from '@angular/common';

// IMPORTANT
// The elements to be create dynamically must be added in the app.module.ts
// in the entryComponents section.

@Injectable({
  providedIn: 'root'
})
export class ComponentService {

  constructor(private resolver: ComponentFactoryResolver,
              private injector: Injector,
              @Inject(DOCUMENT) private document: Document) { }

  CreateComponent(component: any, data: object = null): EventEmitter<any> {
    const componentFactory: any = this.resolver.resolveComponentFactory(component);
    const componentRef = componentFactory.create(this.injector);

    if (data && typeof(data) == 'object') {
      for (const prop in data) {
        componentRef.instance[prop] = data[prop];
      }
    }

    const { nativeElement } = componentRef.location;
    this.document.body.appendChild(nativeElement);
    componentRef.hostView.detectChanges();

    const close: EventEmitter<any> = componentRef.instance.close;
    
    const sub = close.subscribe(() => {
      sub.unsubscribe();
      componentRef.destroy();
      this.document.body.removeChild(nativeElement);
    });

    return close;
  }

  CreateDynamicComponent(component: any, data: object = null): EventEmitter<any> {
    const componentFactory: any = this.resolver.resolveComponentFactory(component);
    const componentRef = componentFactory.create(this.injector);

    if (data && typeof(data) == 'object') {
      for (const prop in data) {
        componentRef.instance[prop] = data[prop];
      }
    }

    const { nativeElement } = componentRef.location;
    this.document.body.prepend(nativeElement);
    componentRef.hostView.detectChanges();

    return componentRef;
  }

  RemoveComponent(componentRef: any) {
    const { nativeElement } = componentRef.location;
    componentRef.destroy();
    this.document.body.removeChild(nativeElement);
  }
}
