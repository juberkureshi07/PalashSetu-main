package com.ambivert.bhashagyan;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.speech.tts.TextToSpeech;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import com.getcapacitor.BridgeActivity;
import java.util.ArrayList;
import java.util.Locale;

public class MainActivity extends BridgeActivity {
    private TextToSpeech nativeTts;
    private SpeechRecognizer nativeSpeechRecognizer;
    private boolean isTtsReady = false;
    private String pendingSpeak = null;

    private void speakNative(String text) {
        if (text == null || text.trim().isEmpty()) return;
        if (nativeTts != null) {
            try {
                android.widget.Toast.makeText(MainActivity.this, "🔊 " + text, android.widget.Toast.LENGTH_SHORT).show();
            } catch (Exception ignored) {}
            nativeTts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "BhashaGyanTTS_" + System.currentTimeMillis());
        }
    }

    private void notifyJs(String jsCode) {
        runOnUiThread(() -> {
            if (bridge != null && bridge.getWebView() != null) {
                bridge.getWebView().evaluateJavascript(jsCode, null);
            }
        });
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Initialize Native Android TextToSpeech Engine
        nativeTts = new TextToSpeech(this, status -> {
            if (status == TextToSpeech.SUCCESS) {
                isTtsReady = true;
                int result = nativeTts.setLanguage(new Locale("hi", "IN"));
                if (result < 0) {
                    result = nativeTts.setLanguage(new Locale("hi"));
                }
                if (result < 0) {
                    result = nativeTts.setLanguage(new Locale("en", "IN"));
                }
                if (result < 0) {
                    nativeTts.setLanguage(Locale.getDefault());
                }
                nativeTts.setSpeechRate(0.85f);
                if (pendingSpeak != null) {
                    final String toSpeak = pendingSpeak;
                    pendingSpeak = null;
                    runOnUiThread(() -> speakNative(toSpeak));
                }
            }
        });

        // Initialize Native 100% Offline SpeechRecognizer
        if (SpeechRecognizer.isRecognitionAvailable(this)) {
            nativeSpeechRecognizer = SpeechRecognizer.createSpeechRecognizer(this);
            nativeSpeechRecognizer.setRecognitionListener(new RecognitionListener() {
                @Override
                public void onReadyForSpeech(Bundle params) {
                    notifyJs("window.onNativeSpeechEvent && window.onNativeSpeechEvent('ready')");
                }
                @Override
                public void onBeginningOfSpeech() {
                    notifyJs("window.onNativeSpeechEvent && window.onNativeSpeechEvent('speaking')");
                }
                @Override
                public void onRmsChanged(float rmsdB) {}
                @Override
                public void onBufferReceived(byte[] buffer) {}
                @Override
                public void onEndOfSpeech() {
                    notifyJs("window.onNativeSpeechEvent && window.onNativeSpeechEvent('end')");
                }
                @Override
                public void onError(int error) {
                    notifyJs("window.onNativeSpeechError && window.onNativeSpeechError('" + error + "')");
                }
                @Override
                public void onResults(Bundle results) {
                    if (results != null) {
                        ArrayList<String> matches = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                        if (matches != null && !matches.isEmpty()) {
                            String recognizedText = matches.get(0).replace("'", "\\'");
                            notifyJs("window.onNativeSpeechResult && window.onNativeSpeechResult('" + recognizedText + "')");
                        }
                    }
                }
                @Override
                public void onPartialResults(Bundle partialResults) {}
                @Override
                public void onEvent(int eventType, Bundle params) {}
            });
        }

        // Request runtime RECORD_AUDIO permission if not yet granted
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.RECORD_AUDIO, Manifest.permission.MODIFY_AUDIO_SETTINGS},
                    101);
        }

        // Grant webview audio capture permission & inject helper bridge
        if (this.bridge != null && this.bridge.getWebView() != null) {
            this.bridge.getWebView().setWebChromeClient(new WebChromeClient() {
                @Override
                public void onPermissionRequest(final PermissionRequest request) {
                    runOnUiThread(() -> request.grant(request.getResources()));
                }
            });

            this.bridge.getWebView().addJavascriptInterface(new Object() {
                @android.webkit.JavascriptInterface
                public void speak(String text) {
                    if (text == null || text.trim().isEmpty()) return;
                    runOnUiThread(() -> {
                        if (!isTtsReady) {
                            pendingSpeak = text;
                        } else {
                            speakNative(text);
                        }
                    });
                }

                @android.webkit.JavascriptInterface
                public void startListening() {
                    runOnUiThread(() -> {
                        if (nativeSpeechRecognizer != null) {
                            try {
                                Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
                                intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
                                intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, "hi-IN");
                                intent.putExtra(RecognizerIntent.EXTRA_PREFER_OFFLINE, true); // Force 100% Offline Intent
                                nativeSpeechRecognizer.startListening(intent);
                            } catch (Exception e) {
                                notifyJs("window.onNativeSpeechError && window.onNativeSpeechError('" + e.getMessage() + "')");
                            }
                        }
                    });
                }

                @android.webkit.JavascriptInterface
                public void stopListening() {
                    runOnUiThread(() -> {
                        if (nativeSpeechRecognizer != null) {
                            try {
                                nativeSpeechRecognizer.stopListening();
                            } catch (Exception ignored) {}
                        }
                    });
                }

                @android.webkit.JavascriptInterface
                public void print() {
                    runOnUiThread(() -> {
                        try {
                            if (bridge != null && bridge.getWebView() != null) {
                                android.print.PrintManager printManager = (android.print.PrintManager) getSystemService(android.content.Context.PRINT_SERVICE);
                                if (printManager != null) {
                                    android.print.PrintDocumentAdapter printAdapter = bridge.getWebView().createPrintDocumentAdapter("BhashaGyan_Print");
                                    printManager.print("Bhasha Gyan Worksheet", printAdapter, new android.print.PrintAttributes.Builder().build());
                                }
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    });
                }

                @android.webkit.JavascriptInterface
                public void openVoiceInputSettings() {
                    try {
                        Intent intent = new Intent(android.provider.Settings.ACTION_VOICE_INPUT_SETTINGS);
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(intent);
                    } catch (Exception e) {
                        try {
                            Intent fallback = new Intent(android.provider.Settings.ACTION_LOCALE_SETTINGS);
                            fallback.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                            startActivity(fallback);
                        } catch (Exception ignored) {}
                    }
                }

                @android.webkit.JavascriptInterface
                public void installTtsData() {
                    try {
                        Intent intent = new Intent(TextToSpeech.Engine.ACTION_INSTALL_TTS_DATA);
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(intent);
                    } catch (Exception e) {
                        openTtsSettings();
                    }
                }

                @android.webkit.JavascriptInterface
                public void openTtsSettings() {
                    try {
                        Intent intent = new Intent("com.android.settings.TTS_SETTINGS");
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(intent);
                    } catch (Exception e) {
                        try {
                            Intent fallback = new Intent(android.provider.Settings.ACTION_SETTINGS);
                            fallback.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                            startActivity(fallback);
                        } catch (Exception ignored) {}
                    }
                }
            }, "AndroidVoiceBridge");
        }
    }

    @Override
    public void onDestroy() {
        if (nativeSpeechRecognizer != null) {
            nativeSpeechRecognizer.destroy();
        }
        if (nativeTts != null) {
            nativeTts.stop();
            nativeTts.shutdown();
        }
        super.onDestroy();
    }
}
