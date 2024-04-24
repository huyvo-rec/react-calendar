import React, { useContext, useEffect } from "react";
import { CalendarContext } from "../common/CalendarContext";
import { makeStyles, Theme } from "@material-ui/core/styles";
import clsx from "clsx";
import { format, differenceInMinutes } from "date-fns";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

const useStyles = makeStyles((theme: Theme) => ({
  marker: {
    overflow: "hidden",
    position: "absolute",
    border: "1px solid rgba(66, 165, 245, 0.8)",
    backgroundColor: "rgba(66, 165, 245, 0.8)",
    padding: "1px 3px",
    borderRadius: 3,
    borderTopRightRadius: 3,
    cursor: "pointer",
    zIndex: 50,
    "&:hover": {
      zIndex: 53,
      backgroundColor: "rgba(66, 165, 245, 1)",
    },
    minHeight: 24,
  },
  markerText: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  beginEnd: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    fontSize: 10,
  },
  extraInfo: {
    fontSize: 7,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    // marginTop: -30,
    // width: 'fit-content',
  },
  formControl: {
    marginTop: theme.spacing(2),
    // minWidth: 120,
  },
  formControlFlex: {
    display: "inline-flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  optionsBar: {
    marginTop: theme.spacing(-1),
    display: "inline-flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
}));

function getStyles(
  left: number,
  top: number,
  isDragging: boolean,
  partOfStyle: React.CSSProperties
): React.CSSProperties {
  const transform = `translate3d(${left}px, ${top}px, 0)`;

  return {
    position: "absolute",
    transform: isDragging ? transform : "initial",
    WebkitTransform: isDragging ? transform : "initial",
    // IE fallback: hide the real node using CSS when dragging
    // because IE will ignore our custom "empty image" drag preview.
    opacity: isDragging ? 0 : 1,
    height: isDragging ? 0 : "",
    ...partOfStyle,
  };
}

function EventMark(props: any) {
  const classes = useStyles();
  const { stateCalendar, setStateCalendar } = useContext(CalendarContext);
  const {
    defaultEventDuration,
    // modal = false,
    // eventDialogMaxWidth = "md",
    // fullscreen = false,
    // allowFullScreen = false,
    // withCloseIcon = true,
    // title,
    // content,
    // actions,
    // openDialog,
    // handleCloseDialog,
    // eventBeginDate,
    // eventBeginTime,
    // eventEndDate,
    // eventEndTime,
    // minutes,
    // locale,
  } = stateCalendar;

  const { calendarEvent, len, sq } = props;
  // console.log(calendarEvent)

  const beginDate = new Date(calendarEvent.begin);
  const endDate = new Date(calendarEvent.end);

  const beginDateFormatted = format(
    beginDate,
    format(beginDate, "mm") === "00" ? "HH" : "HH:mm"
  );
  // const endDateFormatted = format(
  //   endDate,
  //   format(endDate, "mm") === "00" ? "HH" : "HH:mm"
  // );

  const currentDay = beginDate;
  const initTime = new Date(format(currentDay, "yyyy/MM/dd 0:0:0"));
  const position = differenceInMinutes(currentDay, initTime) + 2;

  const duration = differenceInMinutes(endDate, beginDate) - 3;

  const viewEvent = (props: any) => {
    const { calendarEvent } = props;

    setStateCalendar({
      ...stateCalendar,
      openViewDialog: true,
      calendarEvent,
    });
  };

  const left = (100 / len) * sq + 1;

  const partOfStyle: React.CSSProperties = {
    marginTop: position,
    height: duration,
    width: `calc((100% / ${len}) - 2px)`,
    marginLeft: `calc(100% / ${len} * ${sq})`,
  };

  return (
    <div
      id={calendarEvent.id}
      className={classes.marker}
      style={getStyles(left, position / 57 - 2,false, partOfStyle)}
      onClick={(eventEl: any) =>
        viewEvent({
          eventEl,
          calendarEvent,
          defaultEventDuration,
          stateCalendar,
          setStateCalendar,
        })
      }
    >
      <div className={classes.markerText}>{calendarEvent.title}</div>
      <div className={classes.beginEnd}>
        <span>{beginDateFormatted}</span>
        <span> - </span>
       {/* {
        endDate && <span> {format(
          endDate || new Date(),
          format(endDate, "mm") === "00" ? "HH" : "HH:mm"
        )}</span>
       }  */}
      </div>
      <div
        className={clsx(classes.extraInfo, classes.markerText)}
      >{`[${calendarEvent.id}]`}</div>
    </div>
  );
}

export default EventMark;
