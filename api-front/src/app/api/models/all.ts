export class Historico {
    id: number;
    solicitud: string;
    supernumerario: string;
    oficina: string;
    cargo: string;
    sup_inicio_vacaciones: string;
    sup_fin_vacaciones: string;
    fecha_confirmacion: string;
  }

export class Solicitud {
  id: number;
  user: string;
  fecha_solicitud: string;
  fecha_inicio_vacaciones: string;
  fecha_fin_vacaciones: string;
  periodos: number;
  estado: string;
  anexo: string;
    }

export class Cargo {
  id: number;
  nombre: string;
  empalme: number;
  horario: string;
}

export class Ciudad {
  id?: any;
  nombre?: any;
}

export class Oficina {
  id: number;
  nombre: string;
  ciudad: Ciudad;
}

export class Empleado {
  fecha_ingreso?: string;
  periodos_causados?: number;
  cargo?: number;
  oficina?: number;
}

export class EmpleadoS {
  estado?: boolean;
  fecha_ingreso?: string;
  periodos_causados?: number;
  cargo?: number;
  ciudad?: number;
}

export class User {
  id: number;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  is_superuser: boolean;
  empleados: Empleado;
}

export class SuperEmp {
  id: number;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  is_superuser: boolean;
  empleados: EmpleadoS;
}
