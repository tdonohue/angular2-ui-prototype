import {Component, Input} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../../../dspace.directory';

import {DSpaceService} from '../../../dspace.service';

import {Item} from "../../../models/item.model"

import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

import {ComponentTitleComponent} from '../component-title.component';

/**
 * Component for the collections of the simple-item-view.
 * When you click on the collection name, it has to redirect to the right collection.
 */
@Component({
    selector: 'item-full-collections',
    inputs: ['itemData'],
    directives: [ComponentTitleComponent],
    pipes: [TranslatePipe],
    template:
        `<div id="item-collection">
             <component-title [title]="component_title"></component-title>
            <ul>
                <li>
                   <a [attr.href]="collectionURIPrefix+itemData.id">{{itemData.name}}</a>
                </li>
            </ul>
         </div>
            `
})

export class FullCollectionsComponent {

    private component_title : String = "item-view.full.full-collections.title";
    private itemData : Object;
    private collectionURIPrefix = "../collections/";

    constructor(private params: RouteParams,private directory: DSpaceDirectory, translate : TranslateService)
    {
        translate.setDefaultLang('en');
        translate.use('en');
    }

}

