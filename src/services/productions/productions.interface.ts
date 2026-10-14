export interface IGetProductionsByEmail {
    productions: Production[];
}

export interface Production {
    email:                string;
    order:                string;
    startDateAppointment: string;
    endDateAppointment:   string;
    quantity:             number;
    cycleTime:            number;
    cycleTimeElapsed:     number;
}


export interface IPostProduction {
    email:                string;
    order:                string;
    startDateAppointment: Date;
    endDateAppointment:   Date;
    materialCode:         string;
    quantity:             number | string;
    cycleTime:            number | string;
    cycleTimeElapsed:     number | string
}
