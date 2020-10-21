package c01.todoteamname.project.SPORTCRED;

import java.io.IOException;
import java.io.OutputStream;
import java.util.Map;
import org.json.JSONException;
import org.json.JSONObject;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

public class GetOpponent implements HttpHandler {

  Neo4JDB nb = Neo4JDB.createInstanceOfDatabase();

  public GetOpponent() {}

  @Override
  public void handle(HttpExchange r) {
    try {
      if (r.getRequestMethod().equals("POST")) {
        handlePost(r);
      }
    } catch (Exception e) {
      try {
        r.sendResponseHeaders(500, -1);
        e.printStackTrace();
      } catch (IOException e1) {
      }
    }
  }

  public void handlePost(HttpExchange r) throws IOException, JSONException {
    String body = Utils.convert(r.getRequestBody());
    JSONObject deserialized = new JSONObject(body);
    String roomNumber;

    if (deserialized.has("roomNumber")) {
      roomNumber = deserialized.getString("roomNumber");

      Map<String, Object> resultMap = this.nb.sendOpponentDetails(r, roomNumber);
      JSONObject json = new JSONObject(resultMap);
      String response = json.toString();
      r.getResponseHeaders().set("Content-Type", "application/json");
      r.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
      r.sendResponseHeaders(200, response.length());
      OutputStream os = r.getResponseBody();
      os.write(response.getBytes());
      os.close();

    } else {
      r.sendResponseHeaders(400, -1);
    }
  }

}
