import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { logout } from "../reducers/users";
import { useSelector } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { Fontisto } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  const [cryptos, setCryptos] = useState([]);
  const users = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  const url =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=12&page=1&sparkline=false";

  const fetchData = async () => {
    const res = await fetch(`${url}`);
    const data = await res.json();
    data ? setCryptos(data) : console.log(data);
  };

  useEffect(() => {
    fetchData().catch(console.error);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigation.navigate("Sign");
  };

  const listingCrypto = cryptos.map((crypt, index) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() =>
          navigation.navigate("Crypto", {
            crypto: crypt,
          })
        }
      >
        <View
          style={{
            padding: 5,
            height: 120,
            width: 120,
            marginTop: 10,
            alignItems: "center",
            justifyContent: "space-evenly",
            borderRadius: 5,
            backgroundColor:
              crypt.price_change_percentage_24h > 0 ? "#6DB76B" : "#E7595D",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 22, fontWeight: "bold" }}>
            {crypt.symbol.toUpperCase()}
          </Text>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            ${crypt.current_price}
          </Text>
          <Image
            source={{ uri: crypt.image }}
            style={{ height: 40, width: 40 }}
          />
        </View>
      </TouchableOpacity>
    );
  });

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 28, color: "#D4D4D4", paddingTop: 10 }}>
        COIN360
      </Text>

      <View
        style={{
          alignItems: "center",
          height: 80,
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "50%",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <Text style={{ color: "#fff" }}>
            Welcome {users.username.charAt(0).toUpperCase()}
            {users.username.slice(1)}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Favorites")}>
            <Fontisto
              name="favorite"
              size={24}
              color="#fff"
              style={{ paddingLeft: 10 }}
            />
          </TouchableOpacity>
          <Text style={{ color: "#fff" }}>({users.crypto.length})</Text>
        </View>

        <AntDesign
          name="logout"
          size={24}
          color="#fff"
          onPress={() => handleLogout()}
        />
      </View>

      <View
        style={{
          height: "60%",
          width: "90%",
          flexWrap: "wrap",
          justifyContent: "space-around",
          flexDirection: "row",
        }}
      >
        {listingCrypto ? listingCrypto : "Aucune données récuperées"}
      </View>

      <View>
        <TouchableOpacity>
          <FontAwesome
            name="refresh"
            size={36}
            color="#fff"
            onPress={() => fetchData()}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#161817",
  },
});
