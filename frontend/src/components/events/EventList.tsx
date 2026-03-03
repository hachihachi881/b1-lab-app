import React from "react";
import Card from "../common/Card";
import StatusBadge from "../common/StatusBadge";
import Typography from "../common/Typography";

export interface Event {
    id: number;
    date: string;
    title: string;
    location: string;
    description: string;
    type: string;
}

interface EventListProps {
    events: Event[];
}

export default function EventList({ events }: EventListProps) {
    return (
        <div style={{ display: "grid", gap: 24 }}>
            {events.map(event => (
                <Card
                    key={event.id}
                    style={{
                        borderLeft: "4px solid #3b82f6"
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                        <div>
                            <Typography variant="h3" margin="small">
                                {event.title}
                            </Typography>
                            <Typography variant="caption" margin="none" style={{ display: "block", marginBottom: 4 }}>
                                📅 {event.date}
                            </Typography>
                            <Typography variant="caption" margin="medium" style={{ display: "block" }}>
                                📍 {event.location}
                            </Typography>
                        </div>
                        <StatusBadge status={event.type} variant="event" />
                    </div>
                    <Typography variant="p" margin="none" style={{ lineHeight: 1.6 }}>
                        {event.description}
                    </Typography>
                </Card>
            ))}
        </div>
    );
}