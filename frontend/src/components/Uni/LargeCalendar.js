import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useDisclosure } from '@mantine/hooks';

const locales = {
    "en-US": require("date-fns/locale/en-US")
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
});

function LargeCalendar() {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form state constants
    const [eventName, setEventName] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventType, setEventType] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [eventTime, setEventTime] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [visibility, setVisibility] = useState("");

    // Close modal
    const closeEventModal = () => {
        setSelectedEvent(null);
        setIsModalOpen(false);
    };

    // Handle event click
    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const handleEventChange = (e) => {
        setSelectedEvent({
            ...selectedEvent,
            [e.target.name]: e.target.value
        });
    };    

    // Format event data
    const formatEvents = (eventList) => {
        if (!eventList || eventList.length === 0) return;

        const formattedEvents = eventList.map(event => {
            const [datePart, timePart] = event.date_time.split(" ");
            const [year, month, day] = datePart.split("-").map(num => parseInt(num, 10));
            const [hours, minutes, seconds] = timePart.split(":").map(num => parseInt(num, 10));

            return {
                id: event.event_id,
                title: event.name,
                start: new Date(year, month - 1, day, hours, minutes, seconds),
                end: new Date(year, month - 1, day, hours + 1, minutes, seconds),
                category: event.category,
                description: event.description,
                location_id: event.location_id,
                contact_phone: event.contact_phone,
                contact_email: event.contact_email
            };
        });

        setEvents(formattedEvents);
    };

    // Mock API call for form submission
    const submitForm = async () => {
        const formData = {
            name: eventName,
            description: eventDescription,
            category: eventType,
            date: eventDate,
            time: eventTime,
            contact_phone: contactPhone,
            contact_email: contactEmail,
            visibility: visibility
        };

        try {
            const response = await fetch("https://mockapi.io/events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("Event submitted successfully!");
                closeEventModal();
            } else {
                alert("Failed to submit event.");
            }
        } catch (error) {
            console.error("Error submitting event:", error);
        }
    };

    useEffect(() => {
        const dummyData = [
            {
                event_id: 1,
                name: "Tech Trends 2025",
                description: "A discussion on upcoming technology trends and innovations.",
                category: "tech talk",
                date_time: "2025-03-10 15:00:00",
                location_id: 101,
                contact_phone: "123-456-7890",
                contact_email: "info@techevent.com",
                visibility: "public"
            },
            {
                event_id: 2,
                name: "Spring Fundraiser Gala",
                description: "Annual fundraising event for student scholarships.",
                category: "fundraising",
                date_time: "2025-03-15 19:00:00",
                location_id: 102,
                contact_phone: "987-654-3210",
                contact_email: "fundraiser@university.edu",
                visibility: "private"
            }
        ];

        formatEvents(dummyData);
    }, []);

    return (
        <div id="CalendarDiv">
            <Calendar
                className="LargeCalendar"
                id="LargeCalendar"
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                views={["month", "week", "day"]}
                onSelectEvent={handleEventClick}
            />

            {isModalOpen && selectedEvent && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close-btn" onClick={closeEventModal}>&times;</button>
                        <h2 className="modal-name">Edit Event Details</h2>

                        <label>
                            Event Name
                            <input
                                type="text"
                                name="title"
                                value={selectedEvent?.title || ""}
                                onChange={handleEventChange}
                            />
                        </label>

                        <label>
                            Description
                            <input
                                type="text"
                                name="description"
                                value={selectedEvent?.description || ""}
                                onChange={handleEventChange}
                            />
                        </label>

                        <label>
                            Event Type
                            <select
                                name="category"
                                value={selectedEvent?.category || ""}
                                onChange={handleEventChange}
                            >
                                <option value="social">Social</option>
                                <option value="fundraising">Fundraising</option>
                                <option value="tech talk">Tech Talk</option>
                                <option value="other">Other</option>
                            </select>
                        </label>

                        <label>
                            Date
                            <input
                                type="date"
                                name="date"
                                value={selectedEvent?.start ? selectedEvent.start.toISOString().split('T')[0] : ""}
                                onChange={handleEventChange}
                            />
                        </label>

                        <label>
                            Time
                            <input
                                type="time"
                                name="time"
                                value={selectedEvent?.start ? selectedEvent.start.toISOString().split('T')[1].slice(0, 5) : ""}
                                onChange={handleEventChange}
                            />
                        </label>

                        <label>
                            Contact Phone
                            <input
                                type="text"
                                name="contact_phone"
                                value={selectedEvent?.contact_phone || ""}
                                onChange={handleEventChange}
                            />
                        </label>

                        <label>
                            Contact Email
                            <input
                                type="email"
                                name="contact_email"
                                value={selectedEvent?.contact_email || ""}
                                onChange={handleEventChange}
                            />
                        </label>

                        <label>
                            Visibility
                            <select
                                name="visibility"
                                value={selectedEvent?.visibility || ""}
                                onChange={handleEventChange}
                            >
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                                <option value="rso">RSO</option>
                            </select>
                        </label>


                        <div className="modal-buttons">
                            <button className="save-btn" onClick={submitForm}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LargeCalendar;
