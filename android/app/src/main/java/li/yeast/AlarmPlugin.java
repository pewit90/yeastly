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

import androidx.annotation.Nullable;

import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import org.json.JSONStringer;

import java.util.Calendar;
import java.util.Date;
import java.util.UUID;


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

    @PluginMethod()
    public void cancelAlarm(PluginCall call) {
        String alarmId = call.getString("alarmId");
        AlarmManager manager = (AlarmManager) getActivity().getSystemService(Context.ALARM_SERVICE);
        manager.cancel(createAlarmIntent(alarmId, null));
        call.resolve();
    }


    @PluginMethod()
    public void hasRequiredPermissions(PluginCall call) {
        PermissionState permissionState = getPermissionState(ALARM_PERMISSION);
        JSObject result = new JSObject();
        result.put("permissionState", permissionState.toString());
        call.resolve(result);
    }

    @PermissionCallback()
    public void setAlarmCallback(PluginCall call) {
        if (getPermissionState(ALARM_PERMISSION) != PermissionState.GRANTED) {
            call.reject("Permission is required to set alarm");
            return;
        }

        long alarmTime = call.getLong("alarmTime");
        String alarmId = call.getString("alarmId");
        String notificationTitle = call.getString("title" );
        String notificationText = call.getString("text");

        scheduleAlarmWithNotification(alarmId, alarmTime, notificationTitle, notificationText);

        call.resolve();
    }

    private void scheduleAlarmWithNotification(String identifier, long alarmTime, String title, String text) {
        Notification notification = createNotification(title, text);
        PendingIntent notificationPendingIntent = createAlarmIntent(identifier, notification);
        AlarmManager manager = (AlarmManager) getActivity().getSystemService(Context.ALARM_SERVICE);
        manager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, alarmTime, notificationPendingIntent);
    }

    private PendingIntent createAlarmIntent(String identifier, @Nullable Notification notification) {
        Activity activity = getActivity();
        Intent notificationIntent = new Intent(activity, TimedNotificationPublisher.class);
        notificationIntent.setIdentifier(identifier);
        notificationIntent.putExtra(NOTIFICATION_INTENT_KEY, notification);
        return PendingIntent.getBroadcast(activity, requestCode, notificationIntent, PendingIntent.FLAG_CANCEL_CURRENT | PendingIntent.FLAG_IMMUTABLE);
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
                .setSmallIcon(R.mipmap.ic_launcher)
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
        notificationChannel.enableVibration(true);
        notificationChannel.enableLights(true);
        notificationChannel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);

        NotificationManager notificationManager = (NotificationManager) getActivity().getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.createNotificationChannel(notificationChannel);

        return notificationChannel;
    }

}