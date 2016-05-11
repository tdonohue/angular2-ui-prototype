import {Component, Input, OnInit} from '@angular/core';
import { ROUTER_DIRECTIVES, RouteConfig, Router } from '@angular/router-deprecated';

import { ContextProviderService } from '../../../dspace/services/context-provider.service';
import {SidebarService} from '../../../utilities/services/sidebar.service.ts';
import {SidebarSection} from '../../models/sidebar-section.model';
import {SidebarSectionComponent} from './sidebar-section.component';
/**
 * Main component to render the sidebar. Will access the sidebarservice to find out how much components need to be rendered.
 * Using the sidebarservice
 */
@Component({
    selector: "sidebar",
    directives: [ROUTER_DIRECTIVES, SidebarSectionComponent],
    template:
        `
            <div *ngFor="let component of sidebarComponents">
                <sidebar-section [sidebarcomponent]="component"></sidebar-section>
            </div>
        `
})

export class SidebarComponent
{

    private context : any;

    private sidebarComponents;

    constructor(private contextProvider: ContextProviderService, private sidebarService : SidebarService)
    {
        if(contextProvider != null){
        this.context = contextProvider.context;
        contextProvider.contextObservable.subscribe( x => this.context = x);
        }

        // Catch any event that causes the components array to change.
        this.sidebarComponents = this.sidebarService.components;
        sidebarService.sidebarSubject.subscribe(() =>
        {
            this.sidebarComponents = sidebarService.components;
        });
    }

}