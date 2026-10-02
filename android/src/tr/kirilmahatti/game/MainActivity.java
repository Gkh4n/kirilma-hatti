package tr.kirilmahatti.game;
import android.app.*;import android.content.DialogInterface;import android.os.*;import android.webkit.*;import android.view.*;import android.graphics.Color;
public final class MainActivity extends Activity {
 private WebView web;
 @Override public void onCreate(Bundle b){super.onCreate(b);final int background=Color.rgb(8,12,22);
 getWindow().setStatusBarColor(background);getWindow().setNavigationBarColor(background);
 getWindow().setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(background));
 if(Build.VERSION.SDK_INT>=29){getWindow().setStatusBarContrastEnforced(false);getWindow().setNavigationBarContrastEnforced(false);}
 if(Build.VERSION.SDK_INT>=30){getWindow().setDecorFitsSystemWindows(false);}
 else getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE|View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN|View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION);
 final android.widget.FrameLayout root=new android.widget.FrameLayout(this);root.setBackgroundColor(background);
 web=new WebView(this);web.setBackgroundColor(background);
 root.addView(web,new android.widget.FrameLayout.LayoutParams(-1,-1));
 root.setOnApplyWindowInsetsListener(new View.OnApplyWindowInsetsListener(){
  public WindowInsets onApplyWindowInsets(View view,WindowInsets insets){
   if(Build.VERSION.SDK_INT>=30){
    int types=WindowInsets.Type.systemBars()|WindowInsets.Type.displayCutout()|WindowInsets.Type.ime();
    android.graphics.Insets safe=insets.getInsets(types);
    view.setPadding(safe.left,safe.top,safe.right,safe.bottom);
    return new WindowInsets.Builder(insets).setInsets(types,android.graphics.Insets.NONE).setInsetsIgnoringVisibility(WindowInsets.Type.systemBars()|WindowInsets.Type.displayCutout(),android.graphics.Insets.NONE).setDisplayCutout(null).build();
   }
   int l=insets.getSystemWindowInsetLeft(),t=insets.getSystemWindowInsetTop(),r=insets.getSystemWindowInsetRight(),bottom=insets.getSystemWindowInsetBottom();
   if(Build.VERSION.SDK_INT>=28&&insets.getDisplayCutout()!=null){DisplayCutout c=insets.getDisplayCutout();l=Math.max(l,c.getSafeInsetLeft());t=Math.max(t,c.getSafeInsetTop());r=Math.max(r,c.getSafeInsetRight());bottom=Math.max(bottom,c.getSafeInsetBottom());}
   view.setPadding(l,t,r,bottom);WindowInsets remaining=insets.consumeSystemWindowInsets();
   if(Build.VERSION.SDK_INT>=28)remaining=remaining.consumeDisplayCutout();return remaining;
  }
 });
 setContentView(root);
 // Configure appearance only after the decor exists. No early controller dereference.
 getWindow().getDecorView().setSystemUiVisibility(getWindow().getDecorView().getSystemUiVisibility() & ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR & ~View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);
 root.requestApplyInsets();
 WebSettings s=web.getSettings();s.setUserAgentString(s.getUserAgentString()+" KirilmaHattiAndroid");s.setJavaScriptEnabled(true);s.setDomStorageEnabled(true);s.setAllowFileAccess(false);s.setAllowContentAccess(false);s.setMediaPlaybackRequiresUserGesture(true);web.setWebViewClient(new WebViewClient(){@Override public boolean shouldOverrideUrlLoading(WebView v,String u){if(u.equals("khapp://exit")&&"https://game.local/index.html".equals(v.getUrl())){finish();return true;}return !u.equals("https://game.local/index.html");}@Override public WebResourceResponse shouldInterceptRequest(WebView v,WebResourceRequest r){try{if("game.local".equals(r.getUrl().getHost())&&"/index.html".equals(r.getUrl().getPath()))return new WebResourceResponse("text/html","UTF-8",getAssets().open("index.html"));}catch(Exception e){}return new WebResourceResponse("text/plain","UTF-8",new java.io.ByteArrayInputStream(new byte[0]));}});web.setWebChromeClient(new WebChromeClient(){@Override public boolean onJsConfirm(WebView v,String u,String message,final JsResult result){new AlertDialog.Builder(MainActivity.this).setMessage(message).setPositiveButton("Tamam",new DialogInterface.OnClickListener(){public void onClick(DialogInterface d,int w){result.confirm();}}).setNegativeButton("Vazgeç",new DialogInterface.OnClickListener(){public void onClick(DialogInterface d,int w){result.cancel();}}).setOnCancelListener(new DialogInterface.OnCancelListener(){public void onCancel(DialogInterface d){result.cancel();}}).show();return true;}});web.loadUrl("https://game.local/index.html");}
 @Override protected void onPause(){if(web!=null){web.evaluateJavascript("document.dispatchEvent(new Event('visibilitychange'));window.dispatchEvent(new Event('pagehide'));",null);web.onPause();}super.onPause();}
 @Override protected void onResume(){super.onResume();if(web!=null)web.onResume();}
 @Override public void onBackPressed(){if(web!=null)web.evaluateJavascript("if(typeof window.handleAndroidBack==='function'){window.handleAndroidBack();}",null);}
}
