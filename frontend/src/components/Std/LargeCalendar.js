import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
    "en-US" : require("date-fns/locale/en-US")
};

const localizer = dateFnsLocalizer({
   format,
   parse,
   startOfWeek,
   getDay,
   locales
});

const baseUrl = "http://localhost:5000";

function LargeCalendar()
{
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [comment, setComment] = useState("");
    const [newRating, setNewRating] = useState("");

    // Close modal
    const closeEventModal = () => {
        setSelectedEvent(null);
        setIsModalOpen(false);
    };

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };
    
    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const formatEvents = (eventList) => {
        if (!eventList || eventList.length === 0) return;
    
        const formattedEvents = eventList.map(event => {
            const [datePart, timePart] = event.date_time.split(" "); // Split date and time
            const [year, month, day] = datePart.split("-").map(num => parseInt(num, 10));
            const [hours, minutes, seconds] = timePart.split(":").map(num => parseInt(num, 10));
    
            return {
                id: event.event_id,
                title: event.name,
                start: new Date(year, month - 1, day, hours, minutes, seconds), // Correct Date object
                end: new Date(year, month - 1, day, hours + 1, minutes, seconds), // Default 1-hour duration
                category: event.category,
                description: event.description,
                location_id: event.location_id,
                contact_email: event.contact_email
            };
        });
    
        setEvents(formattedEvents);
    };     
  
    const handleAddComment = async () => {
        try {
            const response = await fetch("https://mockapi.io/comments", {
                method: "POST",
                body: JSON.stringify({ comment }),
                headers: { "Content-Type": "application/json" },
            });
    
            if (!response.ok) {
                throw new Error("Failed to add comment");
            }
    
            const result = await response.json();
            console.log("Comment added:", result);
            alert("Comment added successfully!");
    
            setComment("");
        } catch (error) {
            console.error(error);
            alert("Error adding comment");
        }
    };

    const handleAddRating = async () => {
        try {
            const response = await fetch("https://mockapi.io/comments", {
                method: "POST",
                body: JSON.stringify({ comment }),
                headers: { "Content-Type": "application/json" },
            });
    
            if (!response.ok) {
                throw new Error("Failed to add rating");
            }
    
            const result = await response.json();
            console.log("Rating added:", result);
            alert("Rating added successfully!");
    
            setComment(""); // Clear input after submission
        } catch (error) {
            console.error(error);
            alert("Error adding rating");
        }
    };
    
    // useEffect(() => {

    //     var data;
        
    //     const getEventList = async () =>
    //     {
    //         var obj = { RSOID:undefined };
    //         var js = JSON.stringify(obj);
    //         console.log(js);
    //         try
    //         {
    //             const response = await fetch(`${baseUrl}/api/RetrieveEvents`,
    //             {method:'POST',
    //             body:js,
    //             headers:{'Content-Type':'application/json'}});
    //             var res = await response.json();
    //             console.log(res.eventList);
    //             return res.eventList;
    //         }
    //         catch(e)
    //         {
    //             alert(e.toString());
    //             return;
    //         }
    //     };
    
    //     const fetchEventData = async () => {
            
    //         data = await getEventList();
    //         formatEvents(data);          
    //     };

    //     fetchEventData();

    // }, []);


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
                visibility: "public",
                university_id: 1,
                rso_id: 1,
                created_by: 10,
                approved_by: 5
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
                visibility: "private",
                university_id: 1,
                rso_id: 2,
                created_by: 12,
                approved_by: 7
            },
            {
                event_id: 3,
                name: "Tester",
                description: "Annual fundraising event for student scholarships.",
                category: "fundraising",
                date_time: "2025-02-15 19:00:00",
                location_id: 102,
                contact_phone: "987-654-3210",
                contact_email: "fundraiser@university.edu",
                visibility: "private",
                university_id: 1,
                rso_id: 2,
                created_by: 12,
                approved_by: 7
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
                views={['month', 'week', 'day']} 
                onSelectEvent={handleEventClick}
            />

            {/* Event Details Modal */}
            {isModalOpen && selectedEvent && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close-btn" onClick={closeEventModal}>&times;</button>
                        <h2 className="modal-title">{selectedEvent.name}</h2>

                        <p><strong>Event Name:</strong> {selectedEvent.category}</p>
                        <p><strong>Date:</strong> {format(selectedEvent.start, "yyyy-MM-dd")}</p>
                        <p><strong>Time:</strong> {format(selectedEvent.start, "hh:mm a")} - {format(selectedEvent.end, "hh:mm a")}</p>
                        <p><strong>Category:</strong> {selectedEvent.category}</p>
                        <p><strong>Description:</strong> {selectedEvent.description}</p>
                        <p><strong>Location:</strong> {selectedEvent.location_id}</p>
                        <p><strong>Contact Email:</strong> {selectedEvent.contact_email}</p>
                        <p><strong>Contact Phone:</strong> {selectedEvent.contact_email}</p>

                        <hr />

                        <label>
                            Add a Comment
                            <input type="comment" name={"newComment"} value={comment} onChange={handleCommentChange} />
                        </label>
                        <button className="save-btn" onClick={handleAddComment}>Add Comment</button>

                        <h3>Rate this Event</h3>
                        <select value={newRating} onChange={(e) => setNewRating(e.target.value)}>
                            <option value="">Select Rating</option>
                            <option value="1">1 - Poor</option>
                            <option value="2">2 - Fair</option>
                            <option value="3">3 - Good</option>
                            <option value="4">4 - Very Good</option>
                            <option value="5">5 - Excellent</option>
                        </select>
                        <button className="save-btn" onClick={handleAddRating}>Add Rating</button>
                    </div>
                </div>
            )}
        </div>
    );
}


export default LargeCalendar;