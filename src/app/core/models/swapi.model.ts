export interface Person {
    name: string;
    gender: string;
    birth_year: string;
    height: string;
    mass: string;
    homeworld: string;
    species: string[];
    films: string[];
    created: string;
    edited: string;
}

export interface Species {
    name: string;
    url: string;
}

export interface Planet {
    name: string;
    url: string;
}

export interface ApiResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}
