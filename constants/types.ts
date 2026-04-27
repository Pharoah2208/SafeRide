export interface EmergencyContact {
    id: string;
    name: string;
    phone: string;
}

export interface AccidentEvent {
    id: string;
    timestamp: string;
    latitude: number;
    longitude: number;
    confidence: number;
    alertSent: boolean;
}

export interface DetectionSignals {
    speedDrop: boolean;
    impactSpike: boolean;
    orientationChange: boolean;
    inactivity: boolean;
    timestamp: number;
}