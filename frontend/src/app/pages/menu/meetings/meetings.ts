import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { SplitButton } from 'primeng/splitbutton';
import { Toolbar } from 'primeng/toolbar';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';

@Component({
  selector: 'app-meeting-database',
  imports: [
      Button,
      IconField,
      InputIcon,
      InputText,
      SplitButton,
      Toolbar,
      Tab,
      TabList,
      TabPanel,
      TabPanels,
      Tabs
  ],
  templateUrl: './meetings.html',
  styleUrl: './meetings.scss'
})
export class Meetings {

}
