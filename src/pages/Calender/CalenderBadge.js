import styled from "styled-components";
import {CABIN_CREW_TYPES, COCKPIT_CREW_TYPES} from "./constants";

const Badge = styled.div`
  border-radius: 4px;
  font-weight: 500;
  margin: 3px;
  text-align: center;
  cursor: pointer;
  min-height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4px;
`

const BlueBadge = styled(Badge)`
  background-color: #EFF6FF;
  color: #4F46E5;
`

const GreenBadge = styled(Badge)`
  background-color: #DBF0DE;
  color: #2D7938;
`

const RedBadge = styled(Badge)`
  background-color: #FDF2F8;
  color: #BE185D;
`

export default function CalenderBadge({type, children, ...rest}) {
    switch (type) {
        case CABIN_CREW_TYPES.PURSER:
        case COCKPIT_CREW_TYPES.CAPTAIN:
            return <BlueBadge {...rest}>{children}</BlueBadge>
        case CABIN_CREW_TYPES.JUNIOR_PURSER:
        case COCKPIT_CREW_TYPES.FIRST_OFFICER:
            return <RedBadge {...rest}>{children}</RedBadge>
        case CABIN_CREW_TYPES.GENERAL_CREW:
            return <GreenBadge {...rest}>{children}</GreenBadge>
        default:
            return <GreenBadge {...rest}>{children}</GreenBadge>
    }
}