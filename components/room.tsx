import * as React from "react";
import Color from "color";
import { getRandomColor, toPercentage, toPx } from "../lib/helpers";
import { motion, MotionValue, useMotionValue } from "framer-motion";
import { useWindowSize, usePrevious, useRaf } from "react-use";

interface Transform {
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface BaseRoomProps {
    transform: Transform;
    duration: number;
}

interface RoomProps extends BaseRoomProps {
    children: React.ReactNode;
}

interface RoomTextProps {
    color: MotionValue<string>;
    children: React.ReactNode;
}

function compareTransforms(t1: Transform, t2: Transform) {
    return t1.x === t2.x && t1.y === t2.y && t1.w === t2.w && t1.h === t2.h;
}

function RoomText({ children, color }: RoomTextProps) {
    useRaf(0.25);
    const c = new Color(color.get());
    const text = c.l() > 50 ? "#000000" : "#ffffff";
    return <div style={{ color: text }}>{children}</div>;
}

export default function Room({
    transform,
    children,
    duration: durationProp,
}: RoomProps) {
    const { x, y, w, h } = transform;
    const [color, setColor] = React.useState("#00f");
    const [pos, setPos] = React.useState({ x, y, w, h });
    const [duration, setDuration] = React.useState(durationProp);
    const { width, height } = useWindowSize();
    const prevTransform = usePrevious(transform);
    const curBackground = useMotionValue(color);

    React.useEffect(() => {
        if (prevTransform && !compareTransforms(transform, prevTransform)) {
            console.log("inside compare transform check", transform);
            setPos(transform);
        }
    }, [setPos, transform, prevTransform]);

    if (typeof window === "undefined") return null;

    function animationComplete() {
        setColor(getRandomColor());
        setDuration(Math.random() * 2 + 1);
        changePos();
    }

    function changePos() {
        const next = {
            x: Math.random(),
            y: Math.random(),
            w: Math.random() / 6 + 0.1,
            h: Math.random() / 6 + 0.1,
        };
        setPos(next);
    }

    const animate = {
        background: color,
        x: toPx(pos.x * width),
        y: toPx(pos.y * height),
        width: toPercentage(Math.min(pos.w, 1 - pos.x)),
        height: toPercentage(Math.min(pos.h, 1 - pos.y)),
    };

    return (
        <motion.div
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                x: toPx(x * height),
                y: toPx(y * height),
                width: toPercentage(w),
                height: toPercentage(h),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: curBackground,
                border: "2px solid black",
            }}
            animate={animate}
            transition={{ duration: duration }}
            onAnimationComplete={animationComplete}
        >
            <RoomText color={curBackground}>{children}</RoomText>
        </motion.div>
    );
}
