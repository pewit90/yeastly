package li.yeast;

import android.Manifest;
import android.R.drawable;
import android.app.Activity;
import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.media.AudioAttributes;
import android.media.RingtoneManager;
import android.net.Uri;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import java.util.Calendar;
import java.util.Date;


@CapacitorPlugin(
        name = "Alarm",
        permissions = {
                @Permission(alias = AlarmPlugin.ALARM_PERMISSION, strings = {
                        Manifest.permission.VIBRATE,
                        Manifest.permission.SET_ALARM,
                        Manifest.permission.WAKE_LOCK
                })
        }
)
public class AlarmPlugin extends Plugin {

    public static final String ALARM_PERMISSION = "alarm";

    private Context context;
    private Activity activity;
    private static final Integer requestCode = 1;
    private static final String NOTIFICATION_CHANNEL_ID = "ALARM_NOTIFICATIONS";
    public static final String NOTIFICATION_INTENT_KEY = "CAPACITOR_ALARM_NOTIFICATION";

    @PluginMethod()
    public void setAlarm(PluginCall call) {
        if (getPermissionState(ALARM_PERMISSION) != PermissionState.GRANTED) {
            requestPermissionForAlias(ALARM_PERMISSION, call, "setAlarmCallback");
        } else {
            setAlarmCallback(call);
        }
    }

    @PermissionCallback()
    public void setAlarmCallback(PluginCall call) {
        if (getPermissionState(ALARM_PERMISSION) != PermissionState.GRANTED) {
            call.reject("Permission is required to set alarm");
            return;
        }

        this.activity = getActivity();
        this.context = getActivity();

        Integer sec = call.getInt("sec");
        String notificationTitle = call.getString("title", "Alarm");
        String notificationText = call.getString("text", "time up");

        setAlarmWithNotification(sec, notificationTitle, notificationText);

        JSObject json = new JSObject();
        json.put("result", true);
        call.resolve(json);
    }

    private void setAlarmWithNotification(Integer sec, String title, String text) {

        Activity activity = getActivity();

        // create notification
        Notification notification = createNotification(title, text);

        // create notification intent from notification
        Intent notificationIntent = new Intent(activity, TimedNotificationPublisher.class);
        notificationIntent.putExtra(NOTIFICATION_INTENT_KEY, notification);
        PendingIntent notificationPendingIntent = PendingIntent.getBroadcast(activity, requestCode, notificationIntent, PendingIntent.FLAG_CANCEL_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        // clock intent is used when user touch clock icon
        Intent clockIconIntent = new Intent(activity, activity.getClass());
        PendingIntent clockIconPendingIntent = PendingIntent.getActivity(activity, requestCode, clockIconIntent, PendingIntent.FLAG_CANCEL_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        AlarmManager manager = (AlarmManager) activity.getSystemService(Context.ALARM_SERVICE);
        Date currentTime = Calendar.getInstance().getTime();
        long trigger = currentTime.getTime() + 1000L * sec;
        AlarmManager.AlarmClockInfo alarmClockInfo = new AlarmManager.AlarmClockInfo(trigger, clockIconPendingIntent);
        manager.setAlarmClock(alarmClockInfo, notificationPendingIntent);
    }

    private Notification createNotification(String title, String text) {
        Intent intent = buildIntent();
        PendingIntent pendingIntent = PendingIntent.getActivity(getActivity(), requestCode, intent, PendingIntent.FLAG_CANCEL_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        NotificationChannel notificationChannel = getNotificationChannel();
        return new Notification.Builder(getContext(), notificationChannel.getId())
                .setContentTitle(title)
                .setContentText(text)
                .setAutoCancel(false)
                .setOngoing(false)
                .setSmallIcon(drawable.star_on)
                .setContentIntent(pendingIntent)
                .setFlag(Notification.FLAG_INSISTENT, true)
                .build();
    }

    private Intent buildIntent() {
        Intent intent = new Intent(getActivity(), getActivity().getClass());
        intent.setAction(Intent.ACTION_MAIN);
        intent.addCategory(Intent.CATEGORY_LAUNCHER);
        intent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        return intent;
    }

    private NotificationChannel getNotificationChannel() {
        NotificationChannel notificationChannel = new NotificationChannel(
                NOTIFICATION_CHANNEL_ID,
                "Alarms",
                NotificationManager.IMPORTANCE_HIGH
        );

        Uri soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM);
        AudioAttributes soundAttr = new AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_NOTIFICATION_RINGTONE)
                .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                .build();
        notificationChannel.setSound(soundUri, soundAttr);
//        notificationChannel.setVibrationPattern(new long[]{0, 800, 800, 800, 800, 800, 800, 800});
        notificationChannel.enableVibration(true);
        notificationChannel.enableLights(true);
        notificationChannel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);

        NotificationManager notificationManager = (NotificationManager) getActivity().getSystemService(context.NOTIFICATION_SERVICE);
        notificationManager.createNotificationChannel(notificationChannel );

        return notificationChannel;
    }

}