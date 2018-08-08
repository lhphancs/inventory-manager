import { ProductsDisplayComponent } from './components/products/products-display/products-display.component';
import { ProductsAddOrUpdateComponent } from './components/products/products-add-or-update/products-add-or-update.component';
import { ProductsComponent } from './components/products/products.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { EbayComponent } from './components/ebay/ebay.component';
import { CalculatorComponent } from './components/calculator/calculator.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule, MatDialogModule, MatIconModule, MatProgressSpinnerModule } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import {MatMenuModule} from '@angular/material/menu';
import { AccountComponent } from './components/account/account.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AmazonComponent } from './components/amazon/amazon.component';
import { LogoutComponent } from './components/logout/logout.component';
import { FeesComponent } from './components/fees/fees.component';
import { ShippingsComponent } from './components/shippings/shippings.component';
import { CalculatorProfitComponent } from './components/calculator/calculator-profit/calculator-profit.component';
import { CalculatorNeededSaleComponent } from './components/calculator/calculator-needed-sale/calculator-needed-sale.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    EbayComponent,
    CalculatorComponent,
    ProductsComponent,
    ProductsAddOrUpdateComponent,
    ProductsDisplayComponent,
    ConfirmDialogComponent,
    LoginComponent,
    RegisterComponent,
    AccountComponent,
    SettingsComponent,
    AmazonComponent,
    LogoutComponent,
    FeesComponent,
    ShippingsComponent,
    CalculatorProfitComponent,
    CalculatorNeededSaleComponent
  ],
  imports: [
    NgbModule.forRoot(),
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatTabsModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSortModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    FlexLayoutModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmDialogComponent]
})
export class AppModule { }
