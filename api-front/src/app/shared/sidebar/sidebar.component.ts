import { Component, OnInit, EventEmitter } from '@angular/core';
//added
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
// src\app\api\models\User.ts
import { ApiService } from '../../api/service/api.service';

interface FoodNode {
  name: string;
  path: string;
  children?: FoodNode[
  ];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Inicio', path: '/',
  },
  {
    name: 'Empleados', path: null,
    children: [
      {name: 'Empleados', path: '/empleado'},
      {name: 'Supernumerarios', path: '/supernumerario'},
    ]
  },
  {
    name: 'Ciudades', path: null,
    children: [
      {name: 'Lista', path: '/ciudad'},
    ]
  },
  {
    name: 'Oficinas', path: null,
    children: [
      {name: 'Lista', path: '/oficina'},
    ]
  },
  {
    name: 'Cargos', path: null,
    children: [
      {name: 'Lista', path: '/cargo'},
    ]
  },
  {
    name: 'Solicitudes', path: null,
    children: [
      {name: 'Espera', path: '/solicitudes'},
      {name: 'Aceptadas', path: '/solicitud_aceptada'},
      {name: 'Canceladas', path: '/solicitud_cancelada'},
    ]
  },
  {
    name: 'Historico de Solicitudes', path: null,
    children: [
      {name: 'Lista', path: '/historico'},
    ]
  },
];

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})


export class SidebarComponent implements OnInit {

  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      path: node.path,
      child: node.children,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
      node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() {
    this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  ngOnInit(): void {
  }

}
