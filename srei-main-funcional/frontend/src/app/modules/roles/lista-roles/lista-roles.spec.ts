import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaRoles } from './lista-roles';

describe('ListaRoles', () => {
  let component: ListaRoles;
  let fixture: ComponentFixture<ListaRoles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaRoles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaRoles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
